import json
import traceback
import urllib.request
import uuid

from core.models import Node
from core.services.model_service import ReaderBase

class JsonReader(ReaderBase):

    def name(self):
        return "Json reader plugin."

    def identifier(self):
        return "json_reader"

    def read(self, file_path):
        # Based on the file path type, try to read from a remote or local source.
        try:
            if "https://" in file_path or "http://" in file_path or ".com" in file_path:
                response = urllib.request.urlopen(file_path)
                str_response = response.read().decode('utf-8')
                data = json.loads(str_response)
            else:
                with open(file_path, encoding="utf8") as data_file:
                    data = json.load(data_file)
        except Exception:
            traceback.print_exc()
            raise FileNotFoundError("JSON file " + file_path + " not found!")
            return [None]

        # Create root node.
        root_node = Node(str(uuid.uuid4()), "JSON Object", "Root")
        if isinstance(data, dict):
            # Traverse root node's children, passing the root as a top parent.
            for key in data.keys():
                self.read_recursively(root_node, data[key], key)
        else:
            # Consider the possibility of a empty root.
            self.read_recursively(root_node, data, "Root")
        return [root_node]

    def read_recursively(self, parent, data, name):
        # Based on the type of data, we determine how to proceed with parsing.
        if isinstance(data, dict):
            new_node = Node(str(uuid.uuid4()), name, "JSON Object")
            parent.children.append(new_node)
            # If this is a json object, traverse it's fields.
            for key in data.keys():
                self.read_recursively(new_node, data[key], key)

        elif isinstance(data, list):
            new_node = Node(str(uuid.uuid4()), name, "JSON Array")
            parent.children.append(new_node)
            # If this is a json array, traverse all the elements.
            for child in data:
                self.read_recursively(new_node, child, "Array element")

        # If this is a simple type, we just copy it's value into the attribute field.
        # For demo purposes, string and number cases are implemented.
        elif isinstance(data, str):
            new_node = Node(str(uuid.uuid4()), name, "JSON String")
            new_node.attributes["value"] = data
            parent.children.append(new_node)

        elif isinstance(data, (int, float)):
            new_node = Node(str(uuid.uuid4()), name, "JSON Number")
            new_node.attributes["value"] = data
            parent.children.append(new_node)
