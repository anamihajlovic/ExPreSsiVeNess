from setuptools import setup, find_packages

setup(
    name='json_reader',
    version='0.1',
    packages=find_packages(),
    install_requires=['core>=0.1'],
    entry_points = {
        'data.load':
            ['json_reader=reader_json.json_reader:JsonReader'],
    },
    zip_safe=True
)
