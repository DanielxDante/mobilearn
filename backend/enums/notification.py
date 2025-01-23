from enum import Enum

class NOTIFICATION(str, Enum):
    INFO = "info"
    PAYMENT = "payment"
    COURSE = "course"
    CHAT = "chat"

    def __str__(self):
        return self.value
    
    @classmethod
    def values(cls):
        return [member.value for member in cls]