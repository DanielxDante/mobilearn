import datetime

def check_valid_time_range(time_range):
    valid_time_ranges = ["day", "week", "month", "year"]
    return time_range in valid_time_ranges
        