import { TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import useAppStore from '@/store/appStore'

interface FavouriteButtonProps {
    course_id: string;
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({course_id}) => {
    const addFavouriteCourses = useAppStore((state) => state.addFavouriteCourse);
    const removeFavouriteCourses = useAppStore((state) => state.removeFavouriteCourse);
    const getFavouriteCourses = useAppStore((state) => state.getFavouriteCourses);
    const favouriteCourses = useAppStore((state) => state.favourite_courses)
    const channel_id = useAppStore((state) => state.channel_id)
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
            const isFavourite = favouriteCourses?.find(
                (course) => course.course_id.toString() === course_id
            )
            if (isFavourite) {
                setIsPressed(true);
            }
    }, [])
    // console.log("Favourite Courses: " + favouriteCourses)
    useEffect(() => {
        const checkFavourite = async () => {
            await getFavouriteCourses(channel_id.toString());
        }
        checkFavourite();

    }, [channel_id])

    const handleIsPressed = async () => {
        setIsPressed(prevState => !prevState)
        if (isPressed === false) {
            await addFavouriteCourses(Number(course_id));
        } else {
            await removeFavouriteCourses(Number(course_id));
        }
    }

  return (
    <TouchableOpacity onPress={handleIsPressed} style={{marginRight: 20, padding: 3}}>
        <Icon 
            name={isPressed ? 'star' : 'star-o'}
            size={25}
            color={isPressed ? '#FFBF00' : 'gray'}
        />
    </TouchableOpacity>
  )
}

export default FavouriteButton