import { useState, ChangeEvent, FormEvent } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { COURSE_MODE } from "../common/constants/course.constants";

interface Topic {
  topicName: string;
  chapters: string[];
}

interface CourseData {
  courseName: string;
  category: string;
  courseCode: string;
  courseImage: string;
  courseMode: string;
  courseDuration: string;
  originalPrice: string;
  discountedPrice: string;
  youtubeUrl: string;
  brochure: string;
  certificate: string;
  active: boolean;
  topics: Topic[];
}

const AddCourseForm = () => {
  const [course, setCourse] = useState<CourseData>({
    courseName: "",
    category: "",
    courseCode: "",
    courseImage: "",
    courseMode: "",
    courseDuration: "",
    originalPrice: "",
    discountedPrice: "",
    youtubeUrl: "",
    brochure: "",
    certificate: "",
    active: true,
    topics: [{ topicName: "", chapters: [""] }],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleTopicChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newTopics = [...course.topics];
    if (e.target.name === "topicName") {
      newTopics[index].topicName = e.target.value;
    }
    setCourse({ ...course, topics: newTopics });
  };

  const handleChapterChange = (
    tIndex: number,
    cIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newTopics = [...course.topics];
    newTopics[tIndex].chapters[cIndex] = e.target.value;
    setCourse({ ...course, topics: newTopics });
  };

  const addTopic = () => {
    setCourse({
      ...course,
      topics: [...course.topics, { topicName: "", chapters: [""] }],
    });
  };

  const removeTopic = (index: number) => {
    const newTopics = course.topics.filter((_, i) => i !== index);
    setCourse({ ...course, topics: newTopics });
  };

  const addChapter = (tIndex: number) => {
    const newTopics = [...course.topics];
    newTopics[tIndex].chapters.push("");
    setCourse({ ...course, topics: newTopics });
  };

  const removeChapter = (tIndex: number, cIndex: number) => {
    const newTopics = [...course.topics];
    newTopics[tIndex].chapters.splice(cIndex, 1);
    setCourse({ ...course, topics: newTopics });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Course Data Submitted:", course);
  };

  return (
    <Container component={Paper} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Course
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Course Name"
          name="courseName"
          value={course.courseName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Course Code"
          name="courseCode"
          value={course.courseCode}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Course Image URL"
          name="courseImage"
          value={course.courseImage}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          select
          fullWidth
          label="Course Mode"
          name="courseMode"
          value={course.courseMode}
          onChange={handleChange}
          margin="normal"
          required
        >
          {Object.keys(COURSE_MODE).map((mode) => (
            <MenuItem key={mode} value={mode}>
              {mode}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          type="number"
          label="Course Duration (hours)"
          name="courseDuration"
          value={course.courseDuration}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          type="number"
          label="Original Price"
          name="originalPrice"
          value={course.originalPrice}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          type="number"
          label="Discounted Price"
          name="discountedPrice"
          value={course.discountedPrice}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="YouTube URL"
          name="youtubeUrl"
          value={course.youtubeUrl}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Brochure URL"
          name="brochure"
          value={course.brochure}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Certificate URL"
          name="certificate"
          value={course.certificate}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Topics & Chapters
        </Typography>
        {course.topics.map((topic, tIndex) => (
          <Paper key={tIndex} sx={{ p: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Topic Name"
              name="topicName"
              value={topic.topicName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleTopicChange(tIndex, e)
              }
              required
            />
            {topic.chapters.map((chapter, cIndex) => (
              <div
                key={cIndex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <TextField
                  fullWidth
                  label={`Chapter ${cIndex + 1}`}
                  value={chapter}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChapterChange(tIndex, cIndex, e)
                  }
                  required
                />
                <IconButton
                  onClick={() => removeChapter(tIndex, cIndex)}
                  disabled={topic.chapters.length === 1}
                >
                  <Remove />
                </IconButton>
              </div>
            ))}
            <Button
              onClick={() => addChapter(tIndex)}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              Add Chapter
            </Button>
            <Button
              onClick={() => removeTopic(tIndex)}
              variant="contained"
              color="error"
              sx={{ mt: 1, ml: 1 }}
              disabled={course.topics.length === 1}
            >
              Remove Topic
            </Button>
          </Paper>
        ))}
        <Button onClick={addTopic} variant="outlined" sx={{ mt: 2 }}>
          Add Topic
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default AddCourseForm;
