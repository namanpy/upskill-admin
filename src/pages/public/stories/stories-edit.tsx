// src/pages/stories/stories-edit.tsx
import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Switch, FormControlLabel, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStories, updateStory,  } from '../../../repo/banners.api';
import { Story }  from '../../../types/Story'

const StoriesEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    description: '',
    role: '',
    companyName: '',
    before: '',
    after: '',
    skills: '',
    wallOfFame: false,
    duration: '',
    batch_Year: '',
    salaryIncrease: '',
  });
  const [userImageFile, setUserImageFile] = useState<File | null>(null);
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStory = async () => {
      const stories = await fetchStories();
      const foundStory = stories.find(s => s._id === id);
      if (foundStory) {
        setStory(foundStory);
        setFormData({
          name: foundStory.name,
          jobTitle: foundStory.jobTitle,
          description: foundStory.description,
          role: foundStory.role,
          companyName: foundStory.companyName,
          before: foundStory.before,
          after: foundStory.after,
          skills: foundStory.skills.join(', '), // Join array into string for form
          wallOfFame: foundStory.wallOfFame,
          duration: foundStory.duration,
          batch_Year: foundStory.batch_Year,
          salaryIncrease: foundStory.salaryIncrease,
        });
      }
    };
    loadStory();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUserImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUserImageFile(file);
  };

  const handleCompanyLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCompanyLogoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('jobTitle', formData.jobTitle);
    data.append('description', formData.description);
    data.append('role', formData.role);
    data.append('companyName', formData.companyName);
    data.append('before', formData.before);
    data.append('after', formData.after);
    // Split skills by comma, trim, and send as JSON array
    const skillsArray = formData.skills.split(',').map(skill => skill.trim());
    data.append('skills', JSON.stringify(skillsArray));
    data.append('wallOfFame', formData.wallOfFame.toString());
    data.append('duration', formData.duration);
    data.append('batch_Year', formData.batch_Year);
    data.append('salaryIncrease', formData.salaryIncrease);
    if (userImageFile) data.append('userImage', userImageFile);
    if (companyLogoFile) data.append('companyLogoImage', companyLogoFile);

    try {
      await updateStory(story._id, data);
      navigate('/stories/list');
    } catch (err) {
      setError('Failed to update story');
    }
  };

  if (!story) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Edit Story
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
            <TextField label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
            <TextField label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={4} required />
            <TextField label="Role" name="role" value={formData.role} onChange={handleChange} required />
            <TextField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
            <TextField label="Before" name="before" value={formData.before} onChange={handleChange} required />
            <TextField label="After" name="after" value={formData.after} onChange={handleChange} required />
            <TextField label="Skills (comma-separated, e.g., JavaScript, React)" name="skills" value={formData.skills} onChange={handleChange} required />
            <TextField label="Duration" name="duration" value={formData.duration} onChange={handleChange} required />
            <TextField label="Batch Year" name="batch_Year" value={formData.batch_Year} onChange={handleChange} required />
            <TextField label="Salary Increase (%)" name="salaryIncrease" value={formData.salaryIncrease} onChange={handleChange} required />
            <Box>
              <Typography variant="subtitle1" gutterBottom>User Image</Typography>
              <input type="file" accept="image/*" onChange={handleUserImageChange} />
            </Box>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Company Logo</Typography>
              <input type="file" accept="image/*" onChange={handleCompanyLogoChange} />
            </Box>
            <FormControlLabel
              control={<Switch checked={formData.wallOfFame} onChange={handleChange} name="wallOfFame" />}
              label="Wall of Fame"
            />
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" size="large">
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default StoriesEdit;