from setuptools import setup, find_packages

setup(
    name="complex_display",
    version="0.1",
    packages=find_packages(),
    install_requires=['core>=0.1'],
    namespace_packages = ['display_complex'],
    package_data={'display_complex': ['complex_graph.js']},
    entry_points={
        'data.visualize':
            ['complex_display=display_complex.complex:DataDisplay2'],
    },
    zip_safe=False
)