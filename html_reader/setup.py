from setuptools import setup, find_packages

setup(
    name='html_reader',
    version='0.1',
    packages=find_packages(),
    install_requires=['core>=0.1'],
    entry_points={
        'data.load':
            ['html_reader=reader_html.html_reader:HTMLReader'],
    },
    zip_safe=True
)
