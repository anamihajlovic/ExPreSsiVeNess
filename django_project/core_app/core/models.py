class Node:
    def __init__(self, node_id, node_name, node_type):
        self.node_id = node_id
        self.name = node_name
        self.type = node_type
        self.attributes = {}
        self.children = []

    def __eq__(self, other):
        """Override the default Equals behavior"""
        if isinstance(other, self.__class__):
            return self.node_id == other.node_id
        return False
