import os
import jsonpickle

from django.shortcuts import render
from django.apps import apps
from django_project.settings import BASE_DIR


def index(request):
    return render(request, 'core/index.html')


def load_file(request):

    request.session['search_nodes'] = []
    request.session['filtered_nodes'] = []

    reader_id = request.GET.get("reader_id")
    file_input = request.GET.get("file_input")

    if ":" not in file_input:
        STATIC_FOLDER = os.path.join(BASE_DIR, 'core_app/core/static/core/')
        file_input = STATIC_FOLDER + file_input

    reader_plugins = apps.get_app_config('core').reader_plugins
    chosen_reader = None

    for r in reader_plugins:
        if r.identifier() == reader_id:
            chosen_reader = r

    try:
        nodes = chosen_reader.read(file_input)
    except FileNotFoundError as fnf:
        return render(request,'core/treeView.html', {"error": fnf})
    except TypeError as te:
        return render(request,'core/treeView.html', {"error": te})

    serialized_nodes = serialize(nodes)

    # Current nodes to be shown
    request.session['nodes'] = serialized_nodes

    filtered_nodes = deserialize(request, 'nodes')
    tree_data_adapter_adapt(filtered_nodes, filtered_nodes[0])

    return render(request, 'core/treeView.html', {"filtered_nodes": filtered_nodes})


def display_data(request, display_id):
    display_plugins = apps.get_app_config('core').display_plugins
    chosen_plugin = None

    nodes = deserialize(request, 'nodes')
    my_links = []
    graph_script = []

    if display_id != '':

        request.session['display_id'] = display_id

        for p in display_plugins:
            if p.identifier() == display_id:
                chosen_plugin = p

        my_links = chosen_plugin.display(nodes, deserialize(request, 'search_nodes'), deserialize(request, 'filtered_nodes'))
        graph_script = chosen_plugin.get_graph_script()

    filtered_nodes = deserialize(request, 'filtered_nodes')
    if not filtered_nodes and len(nodes) > 0:
            filtered_nodes.append(nodes[0])
            tree_data_adapter_adapt(filtered_nodes, nodes[0])

    return render(request, 'core/graph_view.html', {"bird_links": my_links,
                                                    "my_links": my_links,
                                                    "graph_script": graph_script,
                                                    "search_nodes": deserialize(request, 'search_nodes'),
                                                    "filtered_nodes": filtered_nodes})


def action(request):
    if request.GET.get("reload") is not None:
        request.session['search_nodes'] = []
        request.session['filtered_nodes'] = []

    elif request.GET.get("query") is not None:
        type = request.GET.get("action_type")
        text = request.GET.get("criteria")
        parts = text.split(' ')

        nodes = deserialize(request, 'nodes')

        filtered_nodes = []
        for part in parts:
            if not (type == 'search' and part == ''):
                traverse_tree(nodes[0], filtered_nodes, part)

        serialized_nodes = serialize(filtered_nodes)

        if type == 'search':
            request.session['search_nodes'] = serialized_nodes
        elif type == 'filter':
            request.session['filtered_nodes'] = serialized_nodes

    if not ('display_id' in request.session):
        request.session['display_id'] = ''

    return display_data(request, request.session['display_id'])


def traverse_tree(node, filtered_nodes, keyword):

    if keyword in node.name and node not in filtered_nodes:
        filtered_nodes.append(node)

    for child in node.children:
        traverse_tree(child, filtered_nodes, keyword)


def serialize(nodes):

    serialized_nodes = []
    for node in nodes:
        serialized_nodes.append(jsonpickle.encode(node))

    return serialized_nodes


def deserialize(request, field_name):

    nodes = []
    if field_name in request.session:
        session_nodes = request.session[field_name]
        for node in session_nodes:
            nodes.append(jsonpickle.decode(node))

    return nodes


def tree_data_adapter_adapt(nodes, root):
    for child in root.children:
        nodes.append(child)
        tree_data_adapter_adapt(nodes, child)



