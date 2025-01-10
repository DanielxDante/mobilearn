from enum import Enum

class RECIPIENT(str, Enum):
    USER = "user"
    INSTRUCTOR = "instructor"

    def __str__(self):
        return self.value
    
    @classmethod
    def values(cls):
        return [member.value for member in cls]