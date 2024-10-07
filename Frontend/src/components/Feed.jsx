import Posts from "./Posts";
import styles from "./Home.module.css";

const Feed = () => {
    return (
        <div className={`${styles.feed}`}>
            <Posts />
        </div>
    );
};

export default Feed;
