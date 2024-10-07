import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./Signup.module.css";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Signup = () => {
    const usernameRef = useRef();
    const nameRef = useRef();
    const passwordRef = useRef();
    const emailRef = useRef();

    const [fetched, setFetched] = useState(true);
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.user);
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, []);
    const signupHandler = async (e) => {
        e.preventDefault();
        setFetched(false);
        try {
            const payload = {
                username: usernameRef.current.value,
                name: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
            };
            const response = await fetch(
                "http://localhost:8000/api/user/signup",
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );
            if (response) setFetched(true);
            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                navigate("/login");
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
                onSubmit={signupHandler}
                className={`${styles.form} flex flex-col gap-3 p-8 rounded-lg`}
            >
                <div className={`my-4 text-center`}>
                    <h1 className={`font-bold mb-5`}>LOGO</h1>
                    <p className={` mb-4`}>
                        Signup to see photos & videos from your friends
                    </p>
                </div>
                <div>
                    <Label>Username</Label>
                    <Input
                        type="text"
                        ref={usernameRef}
                        className="focus-visible:ring-transparent"
                    />
                </div>
                <div>
                    <Label>Full Name</Label>
                    <Input
                        type="text"
                        ref={nameRef}
                        className="focus-visible:ring-transparent"
                    />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        ref={emailRef}
                        className="focus-visible:ring-transparent"
                    />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        ref={passwordRef}
                        className="focus-visible:ring-transparent mb-0"
                    />
                </div>
                <div className={`text-xs underline mb-7`}>
                    <Link className={`t`} to="/login">
                        Login User...
                    </Link>
                </div>
                {!fetched && (
                    <Button
                        type="button"
                        className={`flex h-10 justify-center font-semibold items-center bg-black rounded-md ${styles.greytext}`}
                        disabled
                    >
                        Processing...
                        <div className={`${styles.spinner}`}></div>
                    </Button>
                )}
                {fetched && <Button>Signup</Button>}
            </form>
        </div>
    );
};
export default Signup;
