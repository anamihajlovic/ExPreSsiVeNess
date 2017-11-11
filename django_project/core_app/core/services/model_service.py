from abc import ABC, abstractmethod


class ServiceBase(ABC):
    @abstractmethod
    def identifier(self):
        pass

    @abstractmethod
    def name(self):
        pass


class ReaderBase(ServiceBase):
    def load_file(self, file_path):
        model_list = self.read(file_path)

    @abstractmethod
    def read(self, file_path):
        pass


class DisplayBase(ServiceBase):
    @abstractmethod
    def display(self, model_list, search_nodes, filtered_nodes):
        pass
