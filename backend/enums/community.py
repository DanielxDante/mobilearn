from enum import Enum

class COMMUNITY(str, Enum):
    UNIVERSITY = 'university'
    COMPANY = 'company'
    ORGANIZATION = 'organization'
    OTHER = 'other'

    def __str__(self):
        return self.value

    @classmethod
    def values(cls):
        return [member.value for member in cls]