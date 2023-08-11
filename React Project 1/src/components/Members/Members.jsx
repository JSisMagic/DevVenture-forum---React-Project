import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/users.services";
import SingleMember from "./SingleMember";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [blocked, setBlocked] = useState([]);

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        setMembers(data);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
      });
  }, []);

  useEffect(() => {
    getAllUsers().then(setMembers).catch(console.error);
  }, [blocked]);

  const membersToDisplay = members.map((member) => {
    return (
      <div key={member.uid}>
        <SingleMember
          uid={member.uid}
          firstName={member.firstname}
          lastName={member.lastname}
          userName={member.username}
          email={member.email}
          setBlocked={setBlocked}
          isBlock={member.isBlock}
        />
      </div>
    );
  });

  return <div>{membersToDisplay}</div>;
};

export default Members;
