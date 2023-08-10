import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../services/users.services";
import SingleMember from "./SingleMember";

const Members = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        setMembers(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
      });
  }, []);

  const membersToDisplay = members.map((member) => {
    return (
      <div key={member.username}>
        <SingleMember
          firstName={member.firstname}
          lastName={member.lastName}
          userName={member.userName}
          email={member.email}
        />
      </div>
    );
  });

  return <div>{membersToDisplay}</div>;
};

export default Members;
