import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { getUserById } from "../../services/users.services"

const DetailedMember = () => {
  const { id } = useParams()
  const [memberData, setMemberData] = useState({})

  useEffect(() => {
    getUserById(id)
      .then(data => setMemberData(data))
      .catch(console.error)
  }, [id])

  return <div>Welcome to {memberData.username}'s page</div>
}

export default DetailedMember
