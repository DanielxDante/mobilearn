from enum import Enum

class GENDER(str, Enum):
    MALE = 'male'
    FEMALE = 'female'

    def __str__(self):
        return self.value

class STATUS(str, Enum):
    NOT_APPROVED = 'not_approved'
    ACTIVE = 'active'
    DISABLED = 'disabled'

    def __str__(self):
        return self.value

class MEMBERSHIP(str, Enum):
    NORMAL = 'normal'
    MEMBER = 'member'
    CORE_MEMBER = 'core_member'

    def __str__(self):
        return self.value
