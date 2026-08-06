exports.RESUME_PARSE_PROMPT = `You are a resume parser. Extract structured information from the resume text below and return ONLY valid JSON, no markdown, no explanation.

Return this exact JSON structure:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "skills": ["string"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string"
    }
  ],
  "totalExperienceYears": "number"
}

If a field is not found, use an empty string, empty array, or 0 as appropriate. Do not fabricate data.

Resume text:
`;