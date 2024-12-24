from enum import Enum

class COURSE(str, Enum):
    ACADEMIC = 'academic'
    PROFESSIONAL = 'professional'
    SPECIALIZATION = 'specialization'
    PROJECT = 'project'

    def __str__(self):
        return self.value

    @classmethod
    def values(cls):
        return [member.value for member in cls]