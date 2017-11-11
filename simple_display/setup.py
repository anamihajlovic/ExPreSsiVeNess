from setuptools import setup, find_packages

setup(
    name="simple_display",
    version="0.1",
    packages=find_packages(),
    install_requires=['core>=0.1'],
    namespace_packages = ['display_simple'],
    package_data={'display_simple': ['simple_graph.js']},
    entry_points={
        'data.visualize':
            ['simple_display=display_simple.simple:DataDisplay1'],
    },
    zip_safe=False
)