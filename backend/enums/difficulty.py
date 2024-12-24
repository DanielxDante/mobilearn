from enum import Enum

class DIFFICULTY(str, Enum):
    BEGINNER = 'beginner'
    INTERMEDIATE = 'intermediate'
    ADVANCED = 'advanced'

    def __str__(self):
        return self.value

    @classmethod
    def values(cls):
        return [member.value for member in cls]