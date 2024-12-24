from enum import Enum

class MEMBERSHIP(str, Enum):
    NORMAL = 'normal'
    MEMBER = 'member'
    CORE_MEMBER = 'core_member'

    def __str__(self):
        return self.value
    
    @classmethod
    def values(cls):
        return [member.value for member in cls]