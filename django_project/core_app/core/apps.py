from django.apps import AppConfig
import pkg_resources


class CoreAppConfig(AppConfig):
    name = 'core_app.core'
    reader_plugins = []
    display_plugins = []

    def ready(self):
        self.reader_plugins = load_plugins("data.load")
        self.display_plugins = load_plugins("data.visualize")


def load_plugins(name):
    plugins = []
    for ep in pkg_resources.iter_entry_points(group=name):
        p = ep.load()
        plugin = p()
        plugins.append(plugin)
    return plugins
