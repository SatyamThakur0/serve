import { userActions } from "@/store/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const GetSuggestedUsers = () => {
    const dispatch = useDispatch();
    try {
        useEffect(() => {
            fetch("http://localhost:8000/api/user/suggested", {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.success) {
                        dispatch(
                            userActions.setSuggestedUsers(res.suggestedUsers)
                        );
                    }
                });
        }, []);
    } catch (error) {
        console.log(error);
    }
};

export default GetSuggestedUsers;
