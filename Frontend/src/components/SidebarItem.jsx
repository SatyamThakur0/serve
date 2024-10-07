import { Link } from "react-router-dom";
import styles from "./SidebarItem.module.css";

const SidebarItem = ({ item, handleSidebar }) => {
    return (
        <div
            className={`flex py-3 px-5 w-full items-center hover:bg-gray-200 transition-colors cursor-pointer rounded-md justify-start gap-3 bordxer border-red-700`}
            onClick={() => handleSidebar(item.itemName)}
        >
            <div>{item.icon}</div>
            <Link className={styles.custom}>{item.itemName}</Link>
        </div>
    );
};
export default SidebarItem;
