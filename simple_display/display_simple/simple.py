import pkg_resources
from core.services.model_service import DisplayBase
import re


class DataDisplay1(DisplayBase):
    def __init__(self):
        self.nodes = []
        self.links = []
        self.row_chars = 30

    def name(self):
        return "simple_display"

    def identifier(self):
        return "simple"

    def display(self, graph, search_nodes, filtered_nodes):
        if graph is None:
            return "[];"
        elif isinstance(graph, list):
            if len(graph) == 0:
                return "[];"

        self.links = []
        self.nodes = []

        links = "["
        for node in graph:
            self.make_link(node, search_nodes, filtered_nodes)

        for link in self.links:
            links += link
        links = links[:-1] + "];"
        return links

    def get_graph_script(self):
        return pkg_resources.resource_string(__name__, 'simple_graph.js')

    def make_link(self, current_node, search_nodes, filtered_nodes, parent=None):
        attr = self.prepare_attributes(current_node.attributes)
        childrenNumber = len(current_node.children)
        nameFixed = self.prepare_name(current_node.name)

        if (parent is None or not self.is_filtered(parent, filtered_nodes)) and self.is_filtered(current_node, filtered_nodes):
            self.links.append(
                "{ source: '" + str(
                    current_node.node_id) + "|" + nameFixed + "|" + current_node.type + "|" + attr + "|" + str(
                    childrenNumber) + "|" + self.is_searched(current_node, search_nodes) + "', "
                                                                                           "target: '" + str(
                    current_node.node_id) + "|" + nameFixed + "|" + current_node.type + "|" + attr + "|" + str(
                    childrenNumber) + "|" + self.is_searched(current_node, search_nodes) + "'},")

        for child_node in current_node.children:

            if self.is_filtered(current_node, filtered_nodes) and self.is_filtered(child_node, filtered_nodes):
                attrCurrent = self.prepare_attributes(current_node.attributes)
                attrChild = self.prepare_attributes(child_node.attributes)
                childChildrenNumber = len(child_node.children)
                childNameFixed = self.prepare_name(child_node.name)

                link = "{ source: '" + str(
                    current_node.node_id) + "|" + nameFixed + "|" + current_node.type + "|" + attrCurrent + "|" + str(
                    childrenNumber) + "|" + self.is_searched(current_node, search_nodes) + \
                       "', ""target: '" + str(
                    child_node.node_id) + "|" + childNameFixed + "|" + child_node.type + "|" + attrChild + "|" + str(
                    childChildrenNumber) + "|" + self.is_searched(child_node, search_nodes) + "'},"

                if link not in self.links:
                    self.links.append(link)

            self.make_link(child_node, search_nodes, filtered_nodes, current_node)

    @staticmethod
    def prepare_attributes(attributes):
        prepared = ""
        for key, value in attributes.items():
            if isinstance(value, list):
                list_to_string = ''.join(str(e) for e in value)
                prepared = prepared + key + "=" + list_to_string
            else:
                prepared = prepared + key + "=" + str(value)

        prepared = prepared.replace(";", "+")
        prepared = prepared.strip()
        return prepared

    @staticmethod
    def prepare_name(name):
        prepared = None
        prepared = re.escape(name)
        return prepared

    @staticmethod
    def is_searched(node, search_nodes):
        for search_node in search_nodes:
            if search_node.node_id == node.node_id:
                return "true"
        return "false"

    @staticmethod
    def is_filtered(node, filtered_nodes):

        if not filtered_nodes:
            return True

        for search_node in filtered_nodes:
            if search_node.node_id == node.node_id:
                return True

        return False
