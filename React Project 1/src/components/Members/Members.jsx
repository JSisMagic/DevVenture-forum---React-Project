import { useEffect, useState } from "react"
import { getAllUsers } from "../../services/users.services"
import SingleMember from "./SingleMember"
import { Stack } from "@chakra-ui/react"

const Members = () => {
  const [members, setMembers] = useState([])
  const [blocked, setBlocked] = useState([])

  useEffect(() => {
    getAllUsers()
      .then(data => {
        setMembers(data)
      })
      .catch(error => {
        console.error("Error fetching members:", error)
      })
  }, [])

  useEffect(() => {
    getAllUsers().then(setMembers).catch(console.error)
  }, [blocked])

  const membersToDisplay = members.map(member => {
    return (
      <SingleMember
        key={member.id}
        uid={member.uid}
        firstName={member.firstname}
        lastName={member.lastname}
        userName={member.username}
        email={member.email}
        setBlocked={setBlocked}
        isBlock={member.isBlock}
      />
    )
  })

  return <Stack gap={3}>{membersToDisplay}</Stack>
}

export default Members
