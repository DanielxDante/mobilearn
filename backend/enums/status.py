from enum import Enum

class STATUS(str, Enum):
    NOT_APPROVED = 'not_approved'
    ACTIVE = 'active'
    DISABLED = 'disabled'

    def __str__(self):
        return self.value
    
    @classmethod
    def values(cls):
        return [member.value for member in cls]