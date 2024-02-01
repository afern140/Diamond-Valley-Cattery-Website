import Image from 'next/image'
import "./styles.css";

const DisplayButton = () => {
    return (
        <button className="display-button-container">
            <div className="button-image">
                <Image
                    alt="Placeholder"
                    src="/img/Placeholder.png"
                    width={128}
                    height={128}/>
            </div>
            <p className="label">Announcements</p>
        </button>
    );
  };
export default DisplayButton;