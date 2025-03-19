class AppException(Exception):
    def __init__(self, message, status=None):
        self.message = message
        self.status_code = status
        super().__init__(self.message)