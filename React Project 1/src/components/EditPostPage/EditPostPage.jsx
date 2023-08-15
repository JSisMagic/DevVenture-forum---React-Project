import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Form } from "react-router-dom"
import { db } from "../../services/database-services"
import "./EditPostPage.css"
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react"
export function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedDescription, setEditedDescription] = useState("")
  const [editedTags, setEditedTags] = useState("")
  const [editedContent, setEditedContent] = useState("")
  const [oldTags, setOldTags] = useState([])

  useEffect(() => {
    // Fetch the post data based on the ID from the route parameter
    const fetchPost = async () => {
      try {
        const postData = await db.get(`posts/${id}`)
        const oldTags = postData.tags

        setPost(postData)
        setEditedTitle(postData.title)
        setEditedDescription(postData.description)
        setEditedTags(postData.tags.join(" ")) // Convert tags array to a string
        setEditedContent(postData.content)
        setOldTags(oldTags)
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchPost()
  }, [id])

  const handleTitleChange = e => {
    setEditedTitle(e.target.value)
  }

  const handleDescriptionChange = e => {
    setEditedDescription(e.target.value)
  }

  const handleTagsChange = e => {
    setEditedTags(e.target.value)
  }

  const handleContentChange = e => {
    setEditedContent(e.target.value)
  }

  const handleSubmit = async () => {
    try {
      const updatedTagsArray = editedTags.split(" ").map(tag => tag.trim())
      const uniqueUpdatedTagsArray = Array.from(new Set(updatedTagsArray))

      // Update the post with the edited title, description, tags, and content
      await db.update(`posts/${id}`, {
        title: editedTitle,
        description: editedDescription,
        tags: uniqueUpdatedTagsArray,
        content: editedContent,
      })

      // Remove old tags from tags in database
      for (const tag of oldTags) {
        await db.remove(`tags/${tag}/${id}`)
      }

      // Add new tags in tags in database
      for (const tag of uniqueUpdatedTagsArray) {
        await db.set(`tags/${tag}/${id}`, true)
      }

      // Redirect back to the post page after editing
      navigate(`/post-list/${id}`)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      // Remove the post from the database
      await db.remove(`posts/${id}`)

      // Remove the post from tags in the database
      for (const tag of oldTags) {
        await db.remove(`tags/${tag}/${id}`)
      }

      // Redirect back to the post list page after deleting
      navigate("/")
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Flex
      direction="column"
      alignItems="center"
      width="50%"
      background="rgba(255,255,255, 0.05)"
      padding="2rem"
      marginInline="auto"
      borderRadius="md"
      gap={2}
    >
      <Heading>Edit Post</Heading>
      <FormControl>
        <FormLabel>Title</FormLabel>
        <Input type="text" value={editedTitle} onChange={handleTitleChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Input type="text" value={editedDescription} onChange={handleDescriptionChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Tags</FormLabel>
        <Input
          placeholder="Split by space"
          type="text"
          value={editedTags}
          onChange={handleTagsChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Content</FormLabel>
        <Textarea value={editedContent} onChange={handleContentChange} />
      </FormControl>
      <ButtonGroup marginTop={3}>
        <Button onClick={handleSubmit}>Save Changes</Button>
        <Button onClick={handleDelete}>Delete Post</Button>
      </ButtonGroup>
    </Flex>
  )
}
