import uuid

from bs4 import BeautifulSoup
from bs4.element import Tag

from core.models import Node
from core.services.model_service import ReaderBase


class HTMLReader(ReaderBase):
    def identifier(self):
        return "HTMLReader"

    def name(self):
        return "Reading html document"

    def read(self, file_path):
        soup = ""

        if ".html" not in file_path:
            raise TypeError("Must be .html file")
            return

        try:
            with open(file_path, encoding='utf8') as fp:
                soup = BeautifulSoup(fp, "html.parser")
        except FileNotFoundError:
            raise FileNotFoundError("HTML file " + file_path + " not found!")
            return


        if soup.html is None:
            raise TypeError ("Invalid html document.")

        descendants = soup.html.descendants
        descendants_list = list(descendants)
        my_list = [x for x in descendants_list if x != '\n']

        model_list = []
        html_node = Node(str(uuid.uuid4()), 'html', 'tag')
        model_list.append(html_node)

        for child in my_list:
            if str(child).strip() == "":  # skip whitespace
                continue

            node_name = child.name if child.name is not None else child
            node_type = 'tag' if child.name is not None else 'text'



            node = Node(str(uuid.uuid4()), node_name, node_type)

            if isinstance(child, Tag):
                node.attributes = child.attrs
            else:
                node.name = str(child).strip()

            if node.name != ' ' and node.name is not None and node.name != "\n" and node.name != '\t':
                model_list.append(node)

            for i, v in zip(range(len(model_list) - 1, -1, -1), reversed(model_list)):
                if i == model_list.__len__() - 1:
                    continue

                if v.name == child.parent.name:
                    model_list[i].children.append(node)

                    break

        return [model_list[0]]





