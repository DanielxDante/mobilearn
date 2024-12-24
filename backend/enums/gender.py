from enum import Enum

class GENDER(str, Enum):
    MALE = 'male'
    FEMALE = 'female'

    def __str__(self):
        return self.value

    @classmethod
    def values(cls):
        return [member.value for member in cls]