import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./Signup.module.css";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "@/store/userSlice";

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((store) => store.user);

    const [fetched, setFetched] = useState(true);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);

    const loginHandler = async (e) => {
        e.preventDefault();
        setFetched(false);
        try {
            const payload = {
                email: emailRef.current.value,
                password: passwordRef.current.value,
            };
            const response = await fetch(
                "http://localhost:8000/api/user/login",
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );
            if (response) {
                setFetched(true);
            }
            const data = await response.json();
            console.log(data);

            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.payload));
                dispatch(
                    userActions.setUser(
                        JSON.parse(localStorage.getItem("user"))
                    )
                );
                navigate("/");
                toast.success(data.message);
            } else toast.warning(data.message);
        } catch (error) {
            console.log(error);
        } finally {
            setFetched(true);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <form
                onSubmit={loginHandler}
                className={`${styles.form} flex flex-col gap-3 p-8 rounded-lg`}
            >
                <div className={`my-4 text-center`}>
                    <h1 className={`font-bold mb-5`}>LOGO</h1>
                    <p className={` mb-4`}>
                        Login to see photos & videos from your friends
                    </p>
                </div>
                <div>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        ref={emailRef}
                        className="border-slate-300 focus-visible:ring-transparent"
                    />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        ref={passwordRef}
                        className="border-slate-300 focus-visible:ring-transparent"
                    />
                </div>
                <div className={`text-xs underline`}>
                    <Link className={`t`} to="/signup">
                        Register User...
                    </Link>
                    <Link className={`float-right disable`} to="/signup">
                        Forgot Password
                    </Link>
                </div>

                {!fetched && (
                    <Button
                        type="button"
                        className={`mt-5 flex h-10 justify-center font-semibold items-center bg-black rounded-md ${styles.greytext}`}
                        disabled
                    >
                        Processing...
                        <div className={`${styles.spinner}`}></div>
                    </Button>
                )}
                {fetched && <Button className={`mt-5`}>Login</Button>}
            </form>
        </div>
    );
};
export default Login;
