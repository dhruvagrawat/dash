'use client';
import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { SetStateAction, useState } from "react";
import {
  Pencil,
  FileText,
  Trash2,
  X,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Briefcase,
  Award,
  User,
  CheckCircle2
} from "lucide-react";


// Constants for job profile data
const MAX_PROFILES = 5;
const PROFILE_STEPS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'experience', label: 'Work Experience', icon: Briefcase },
  { id: 'skills', label: 'Skills & Certifications', icon: Award },
  { id: 'review', label: 'Review', icon: CheckCircle2 }
];

// Initial Job Profile Structure
const INITIAL_JOB_PROFILE = {
  id: 0,
  title: '',
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  },
  education: [
    {
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrently: false,
      gpa: '',
      additionalDetails: ''
    }
  ],
  workExperience: [
    {
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrently: false,
      responsibilities: '',
      achievements: ''
    }
  ],
  skills: {
    technicalSkills: [],
    softSkills: [],
    certifications: []
  },
  createdDate: new Date().toLocaleDateString()
};

export default function Page() {
  const [jobProfiles, setJobProfiles] = useState<typeof INITIAL_JOB_PROFILE[]>([]);
  const [editingProfile, setEditingProfile] = useState<typeof INITIAL_JOB_PROFILE | null>(null);
  const [currentStep, setCurrentStep] = useState('personal');

  const addJobProfile = () => {
    if (jobProfiles.length < MAX_PROFILES) {
      const newProfile = {
        ...INITIAL_JOB_PROFILE,
        id: jobProfiles.length + 1
      };
      setEditingProfile(newProfile);
      setCurrentStep('personal');
    }
  };

  const removeJobProfile = (id: any) => {
    setJobProfiles(jobProfiles.filter(profile => profile.id !== id));
  };

  const startEditProfile = (profile: SetStateAction<{ id: number; title: string; personalInfo: { fullName: string; professionalTitle: string; email: string; phone: string; location: string; summary: string; }; education: { degree: string; institution: string; fieldOfStudy: string; startDate: string; endDate: string; isCurrently: boolean; gpa: string; additionalDetails: string; }[]; workExperience: { jobTitle: string; company: string; location: string; startDate: string; endDate: string; isCurrently: boolean; responsibilities: string; achievements: string; }[]; skills: { technicalSkills: never[]; softSkills: never[]; certifications: never[]; }; createdDate: string; } | null>) => {
    setEditingProfile(profile);
    setCurrentStep('personal');
  };

  const updateProfileField = (section: string, field: string, value: string, index: number | null = null) => {
    if (!editingProfile) return;

    const updatedProfile = { ...editingProfile };

    if (index !== null) {
      // For array fields like education or work experience
      (updatedProfile[section as keyof typeof updatedProfile] as any)[index][field] = value;
    } else {
      // For nested object fields
      (updatedProfile[section as keyof typeof updatedProfile] as any)[field] = value;
    }

    setEditingProfile({ ...updatedProfile, id: updatedProfile.id || 0 });
  };

  const addEducationEntry = () => {
    if (!editingProfile) return;

    const updatedProfile = {
      ...editingProfile,
      education: [
        ...editingProfile.education,
        { ...INITIAL_JOB_PROFILE.education[0] }
      ]
    };
    setEditingProfile({ ...updatedProfile, id: updatedProfile.id ?? 0, title: updatedProfile.title || '' });
  };

  const addWorkExperienceEntry = () => {
    const updatedProfile = {
      ...editingProfile,
      workExperience: [
        ...(editingProfile?.workExperience || []),
        { ...INITIAL_JOB_PROFILE.workExperience[0] }
      ]
    };
    //@ts-ignore
    setEditingProfile({ ...updatedProfile, id: updatedProfile.id ?? 0 });
  };

  const handleNextStep = () => {
    const currentStepIndex = PROFILE_STEPS.findIndex(step => step.id === currentStep);
    if (currentStepIndex < PROFILE_STEPS.length - 1) {
      setCurrentStep(PROFILE_STEPS[currentStepIndex + 1].id);
    }
  };

  const handlePreviousStep = () => {
    const currentStepIndex = PROFILE_STEPS.findIndex(step => step.id === currentStep);
    if (currentStepIndex > 0) {
      setCurrentStep(PROFILE_STEPS[currentStepIndex - 1].id);
    }
  };

  const saveProfile = () => {
    if (editingProfile && editingProfile.id) {
      const existingIndex = editingProfile ? jobProfiles.findIndex(p => p.id === editingProfile.id) : -1;

      if (existingIndex !== -1) {
        const updatedProfiles = [...jobProfiles];
        updatedProfiles[existingIndex] = editingProfile;
        setJobProfiles(updatedProfiles);
      } else {
        setJobProfiles([...jobProfiles, editingProfile]);
      }
    }
    setEditingProfile(null);
  };

  const renderProfileEditModal = () => {
    if (!editingProfile) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl h-[90vh] overflow-auto relative flex flex-col">
          {/* Step Indicator */}
          <div className="flex justify-between mb-6 border-b pb-4">
            {PROFILE_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isPassed = PROFILE_STEPS.findIndex(s => s.id === step.id) <
                PROFILE_STEPS.findIndex(s => s.id === currentStep);

              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 ${isActive ? 'text-primary' : isPassed ? 'text-green-500' : 'text-muted-foreground'}`}
                >
                  <StepIcon className="w-5 h-5" />
                  <span className="text-sm">{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Close Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={() => setEditingProfile(null)}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Form Content */}
          <div className="flex-grow">
            {currentStep === 'personal' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={editingProfile.personalInfo.fullName}
                      onChange={(e) => updateProfileField('personalInfo', 'fullName', e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label>Professional Title</Label>
                    <Input
                      value={editingProfile.personalInfo.professionalTitle}
                      onChange={(e) => updateProfileField('personalInfo', 'professionalTitle', e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editingProfile.personalInfo.email}
                      onChange={(e) => updateProfileField('personalInfo', 'email', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={editingProfile.personalInfo.phone}
                      onChange={(e) => updateProfileField('personalInfo', 'phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={editingProfile.personalInfo.location}
                      onChange={(e) => updateProfileField('personalInfo', 'location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Professional Summary</Label>
                    <Textarea
                      value={editingProfile.personalInfo.summary}
                      onChange={(e) => updateProfileField('personalInfo', 'summary', e.target.value)}
                      placeholder="Write a brief professional summary"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'education' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Education</h2>
                  <Button onClick={addEducationEntry} variant="outline">
                    Add Another Education
                  </Button>
                </div>
                {editingProfile.education.map((edu, index) => (
                  <div key={index} className="border p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateProfileField('education', 'degree', e.target.value, index)}
                          placeholder="e.g., Bachelor of Science"
                        />
                      </div>
                      <div>
                        <Label>Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateProfileField('education', 'institution', e.target.value, index)}
                          placeholder="Name of University"
                        />
                      </div>
                      <div>
                        <Label>Field of Study</Label>
                        <Input
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateProfileField('education', 'fieldOfStudy', e.target.value, index)}
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                      <div>
                        <Label>GPA</Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) => updateProfileField('education', 'gpa', e.target.value,)}
                          placeholder="e.g., 3.8"
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => updateProfileField('education', 'startDate', e.target.value, index)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => updateProfileField('education', 'endDate', e.target.value, index)}
                          disabled={edu.isCurrently}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Additional Details</Label>
                        <Textarea
                          value={edu.additionalDetails}
                          onChange={(e) => updateProfileField('education', 'additionalDetails', e.target.value, index)}
                          placeholder="Any additional information about your education"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 'experience' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Work Experience</h2>
                  <Button onClick={addWorkExperienceEntry} variant="outline">
                    Add Another Job
                  </Button>
                </div>
                {editingProfile.workExperience.map((job, index) => (
                  <div key={index} className="border p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={job.jobTitle}
                          onChange={(e) => updateProfileField('workExperience', 'jobTitle', e.target.value, index)}
                          placeholder="e.g., Senior Software Engineer"
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={job.company}
                          onChange={(e) => updateProfileField('workExperience', 'company', e.target.value, index)}
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={job.location}
                          onChange={(e) => updateProfileField('workExperience', 'location', e.target.value, index)}
                          placeholder="City, Country"
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={job.startDate}
                          onChange={(e) => updateProfileField('workExperience', 'startDate', e.target.value, index)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={job.endDate}
                          onChange={(e) => updateProfileField('workExperience', 'endDate', e.target.value, index)}
                          disabled={job.isCurrently}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Responsibilities</Label>
                        <Textarea
                          value={job.responsibilities}
                          onChange={(e) => updateProfileField('workExperience', 'responsibilities', e.target.value, index)}
                          placeholder="Key responsibilities and duties"
                          rows={4}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Achievements</Label>
                        <Textarea
                          value={job.achievements}
                          onChange={(e) => updateProfileField('workExperience', 'achievements', e.target.value, index)}
                          placeholder="Notable achievements and impact"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 'skills' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Skills & Certifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Technical Skills</Label>
                    <Textarea
                      placeholder="List technical skills, separated by commas"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Soft Skills</Label>
                    <Textarea
                      placeholder="List soft skills, separated by commas"
                      rows={4}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Certifications</Label>
                    <Textarea
                      placeholder="List certifications with dates"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Review Profile</h2>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <p>{editingProfile.personalInfo.fullName} - {editingProfile.personalInfo.professionalTitle}</p>
                  <p>{editingProfile.personalInfo.email} | {editingProfile.personalInfo.phone}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Education</h3>
                  {editingProfile.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                      <p>{edu.degree} in {edu.fieldOfStudy} from {edu.institution}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Work Experience</h3>
                  {editingProfile.workExperience.map((job, index) => (
                    <div key={index} className="mb-2">
                      <p>{job.jobTitle} at {job.company}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 border-t pt-4">
            {currentStep !== 'personal' && (
              <Button variant="outline" onClick={handlePreviousStep}>
                <ChevronLeft className="mr-2 w-4 h-4" /> Previous
              </Button>
            )}

            {currentStep !== 'review' ? (
              <Button onClick={handleNextStep} className="ml-auto">
                Next <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={saveProfile} className="ml-auto">
                Save Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Job Profiles Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 px-4 py-10 text-center">
          <div className="text-lg font-semibold">Manage your job profiles below.</div>
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <span className="text-sm text-muted-foreground">
              {jobProfiles.length}/{MAX_PROFILES} Profiles
            </span>
            <Button onClick={addJobProfile} disabled={jobProfiles.length >= MAX_PROFILES}>
              Add Job Profile
            </Button>
          </div>
          <div className="flex flex-col gap-4 items-center max-w-4xl mx-auto">
            {jobProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center bg-muted/50 p-4 rounded-xl w-full max-w-lg">
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{profile.personalInfo?.fullName || 'Unnamed Profile'}</h3>
                  <p className="text-sm text-muted-foreground">{profile.personalInfo?.professionalTitle || 'No Title'}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => startEditProfile(profile)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Link href="/apply">
                    <Button size="icon" variant="ghost">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button size="icon" variant="ghost" onClick={() => removeJobProfile(profile.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            You can add up to {MAX_PROFILES} job profiles. Edit, remove, or apply using the buttons above.
          </div>
        </div>

        {/* Profile Editing Modal */}
        {renderProfileEditModal()}
      </SidebarInset>
    </SidebarProvider>
  );
}