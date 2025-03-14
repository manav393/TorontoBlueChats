import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import chattingSVg from "../svgs/phone.svg";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";

const MainPage = () => {
  const [isPhone, setPhone] = useState(window.innerWidth < 480);

  const updateMedia = () => {
    setPhone(window.innerWidth < 480);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const instructions_class = isPhone ? "" : "mt-4";
  const instructions_fontsize = isPhone ? "1rem" : "1.5rem";

  return (
    <>
      <Container className={!isPhone ? "my-5" : "my-3"}>
        <div className={"d-flex justify-content-center"}>
          <div style={{ minWidth: 0 }}>
            {!isPhone && (
              <h1 className="title gradient-text" style={{ fontSize: "3rem" }}>
                Welcome to TorontoBlueChats
              </h1>
            )}
            <h3
              className={instructions_class}
              style={{ fontSize: instructions_fontsize }}
            >
              Find &amp; Upload Group Chats for Courses at the UofT St.George
              Campus
            </h3>
            <SearchBar isPhone={isPhone} />
          </div>
          <div
            className={"d-flex align-self-start flex-column d-none d-lg-block"}
          >
            <Image
              fluid
              className={"w-100  flex-grow-1 px-5 "}
              src={chattingSVg}
            />
            <p className={"text-center subtext mt-1 d-none d-lg-block"}>
              TorontoBlueChats is not officially affiliated with the Univeristy
              of Toronto.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default MainPage;
