import { useState, ChangeEvent, FormEvent } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { COURSE_MODE } from "../common/constants/course.constants";

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
}

interface Chapter {
  _id?: string;
  name: string;
  chapterNumber: number;
  active: boolean;
}

interface Topic {
  _id?: string;
  topicName: string;
  week: number;
  session: number;
  chapters: Chapter[];
}

interface CourseData {
  _id?: string;
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
  faqs: FAQ[];
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
    topics: [
      {
        topicName: "",
        week: 1,
        session: 1,
        chapters: [{ name: "", chapterNumber: 1, active: true }],
      },
    ],
    faqs: [{ question: "", answer: "" }],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleTopicChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newTopics = [...course.topics];
    newTopics[index] = { ...newTopics[index], [field]: value };
    setCourse({ ...course, topics: newTopics });
  };

  const handleChapterChange = (
    tIndex: number,
    cIndex: number,
    field: string,
    value: string | number | boolean
  ) => {
    const newTopics = [...course.topics];
    newTopics[tIndex].chapters[cIndex] = {
      ...newTopics[tIndex].chapters[cIndex],
      [field]: value,
    };
    setCourse({ ...course, topics: newTopics });
  };

  const handleFAQChange = (
    index: number,
    field: "question" | "answer",
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newFAQs = [...course.faqs];
    newFAQs[index][field] = e.target.value;
    setCourse({ ...course, faqs: newFAQs });
  };

  const addTopic = () => {
    setCourse({
      ...course,
      topics: [
        ...course.topics,
        {
          topicName: "",
          week: 1,
          session: 1,
          chapters: [{ name: "", chapterNumber: 1, active: true }],
        },
      ],
    });
  };

  const removeTopic = (index: number) => {
    const newTopics = course.topics.filter((_, i) => i !== index);
    setCourse({ ...course, topics: newTopics });
  };

  const addChapter = (tIndex: number) => {
    const newTopics = [...course.topics];
    const nextChapterNumber = newTopics[tIndex].chapters.length + 1;
    newTopics[tIndex].chapters.push({
      name: "",
      chapterNumber: nextChapterNumber,
      active: true,
    });
    setCourse({ ...course, topics: newTopics });
  };

  const removeChapter = (tIndex: number, cIndex: number) => {
    const newTopics = [...course.topics];
    newTopics[tIndex].chapters.splice(cIndex, 1);
    // Update remaining chapter numbers
    newTopics[tIndex].chapters.forEach((chapter, idx) => {
      chapter.chapterNumber = idx + 1;
    });
    setCourse({ ...course, topics: newTopics });
  };

  const addFAQ = () => {
    setCourse({
      ...course,
      faqs: [...course.faqs, { question: "", answer: "" }],
    });
  };

  const removeFAQ = (index: number) => {
    const newFAQs = course.faqs.filter((_, i) => i !== index);
    setCourse({ ...course, faqs: newFAQs });
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
              value={topic.topicName}
              onChange={(e) =>
                handleTopicChange(tIndex, "topicName", e.target.value)
              }
              required
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Week"
              value={topic.week}
              onChange={(e) =>
                handleTopicChange(tIndex, "week", Number(e.target.value))
              }
              sx={{ width: "200px", mr: 2 }}
              required
            >
              {[...Array(52)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  Week {i + 1}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Session"
              value={topic.session}
              onChange={(e) =>
                handleTopicChange(tIndex, "session", Number(e.target.value))
              }
              sx={{ width: "200px" }}
              required
            >
              {[...Array(10)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  Session {i + 1}
                </MenuItem>
              ))}
            </TextField>
            {topic.chapters.map((chapter, cIndex) => (
              <div
                key={cIndex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                  gap: "10px",
                }}
              >
                <TextField
                  fullWidth
                  label={`Chapter ${chapter.chapterNumber}`}
                  value={chapter.name}
                  onChange={(e) =>
                    handleChapterChange(tIndex, cIndex, "name", e.target.value)
                  }
                  required
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={chapter.active}
                      onChange={(e) =>
                        handleChapterChange(
                          tIndex,
                          cIndex,
                          "active",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Active"
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

        <Typography variant="h6" sx={{ mt: 2 }}>
          Frequently Asked Questions
        </Typography>
        {course.faqs.map((faq, index) => (
          <Paper key={index} sx={{ p: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Question"
              value={faq.question}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFAQChange(index, "question", e)
              }
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Answer"
              value={faq.answer}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFAQChange(index, "answer", e)
              }
              required
              multiline
              rows={2}
            />
            <Button
              onClick={() => removeFAQ(index)}
              variant="contained"
              color="error"
              sx={{ mt: 1 }}
              disabled={course.faqs.length === 1}
            >
              Remove FAQ
            </Button>
          </Paper>
        ))}
        <Button onClick={addFAQ} variant="outlined" sx={{ mt: 2 }}>
          Add FAQ
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3, display: "block" }}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default AddCourseForm;
