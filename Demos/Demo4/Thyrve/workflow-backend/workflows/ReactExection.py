class ReactError(Exception):
    def __init__(self, type, *args):
        super().__init__(*args)
        self.type = type
