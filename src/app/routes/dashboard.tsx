/**
 * Dashboard Home
 * 
 * Primary teacher workspace with:
 * - Welcome message
 * - Quick create action
 * - Recent lessons
 * - Quick actions
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { PageLayout } from '../components/page-layout';
import { PageHeader } from '../components/page-header';
import { RibbonHeader } from '../components/ribbon-header';
import { 
  Plus, 
  FileText, 
  BookCheck,
  Clock,
  Calendar,
  ArrowRight,
  Apple,
  Loader2
} from 'lucide-react';
import { Lesson, getStatusColor, getStatusLabel, formatDate } from '../types/lesson-types';
import { GinghamAccent, AppleIcon, PolkaDotPanel } from '../components/decorative-patterns';
import { isAuthenticated } from '../../utils/supabase-auth';
import { toast } from 'sonner';
import { getAllLessons, type SavedLesson } from '../utils/supabase-lessons';

// Convert SavedLesson to Lesson type for display
function convertToLesson(saved: SavedLesson): Lesson {
  return {
    id: saved.id,
    title: saved.name || 'Untitled Lesson',
    subject: saved.data?.subject === 'math' ? 'Math' : 'ELA',
    status: (saved.data?.status as any) || 'draft',
    createdAt: saved.createdAt,
    updatedAt: saved.updatedAt,
    curriculumSummary: saved.data?.curriculumSummary || saved.name || 'No summary',
    duration: '30 min',
    sources: saved.data?.sources || 'Unknown',
    setupComplete: !!saved.data?.setupComplete,
    materialsUploaded: !!saved.metadata?.uploadedFiles,
    materialCount: saved.metadata?.uploadedPPTXFiles?.length || 0,
    extractionComplete: !!saved.metadata?.pptxAnalysis,
    slidesGenerated: false,
    slideCount: 0,
  };
}

export default function Dashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadLessons();
  }, []);

  async function checkAuthAndLoadLessons() {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      const authenticated = await isAuthenticated();
      
      if (!authenticated) {
        toast.error('You must be logged in to access this page.');
        navigate('/login');
        return;
      }
      
      // User is authenticated, load lessons
      await loadLessons();
    } catch (error) {
      console.error('❌ Error checking auth:', error);
      toast.error('Authentication error. Please sign in.');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadLessons() {
    try {
      const allLessons = await getAllLessons();
      // Convert to Lesson type and take only the 5 most recent
      const recentLessons = allLessons
        .map(convertToLesson)
        .slice(0, 5);
      setLessons(recentLessons);
    } catch (error) {
      console.error('❌ Error fetching lessons:', error);
      
      // If it's an auth error, redirect to login
      if (error instanceof Error && error.message.includes('not signed in')) {
        toast.error('Your session has expired. Please sign in again.');
        navigate('/login');
      } else {
        toast.error('Failed to load lessons');
      }
    }
  }

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  
  // Get today's date
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Get last active lesson (most recently updated)
  const lastLesson = lessons.length > 0 
    ? [...lessons].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0]
    : null;

  return (
    <PageLayout>
      <PageHeader 
        title={`${greeting}, Jodie!`}
        description="✨ Ready to build something wonderful today? ✨"
        action={
          <Link to="/lessons/new">
            <Button size="lg" className="bg-[#C84C4C] hover:bg-[#B43D3D] text-white font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              🍎 Create New Lesson
            </Button>
          </Link>
        }
      />

      <div className="mb-6 text-base text-right" style={{ color: '#999999' }}>
        📅 {today}
      </div>

      {/* Continue Last Lesson (if exists) */}
      {lastLesson && lastLesson.status !== 'taught' && (
        <Card className="mb-6 border-2 overflow-hidden" style={{ borderColor: '#CFE3F5', backgroundColor: '#F8FBFF' }}>
          <GinghamAccent />
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1" style={{ color: '#1F2A44' }}>Continue where you left off</p>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#1F2A44' }}>
                  {lastLesson.title}
                </h3>
                <div className="flex items-center gap-3 text-sm" style={{ color: '#666666' }}>
                  <span>{lastLesson.curriculumSummary}</span>
                  <span>•</span>
                  <span>{lastLesson.duration}</span>
                </div>
              </div>
              <Link to={`/lessons/${lastLesson.id}`}>
                <Button size="lg" className="bg-[#C84C4C] hover:bg-[#B43D3D]">
                  Continue Lesson
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Lessons */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Lessons</h2>
            <Link to="/lessons">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {isLoading && (
              <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                <GinghamAccent />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin" />
                  </div>
                </CardContent>
              </Card>
            )}

            {!isLoading && lessons.map((lesson) => (
              <Link key={lesson.id} to={`/lessons/${lesson.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  <GinghamAccent />
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 truncate" style={{ color: '#1F2A44' }}>
                          {lesson.title}
                        </h3>
                        <p className="text-sm" style={{ color: '#666666' }}>
                          {lesson.curriculumSummary}
                        </p>
                      </div>
                      <Badge className={getStatusColor(lesson.status)}>
                        {getStatusLabel(lesson.status)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm" style={{ color: '#999999' }}>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(lesson.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lesson.duration}
                      </div>
                      {lesson.slidesGenerated && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {lesson.slideCount} slides
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {!isLoading && lessons.length === 0 && (
              <PolkaDotPanel variant="pink">
                <div className="text-center py-8">
                  <AppleIcon size={64} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#1F2A44', fontFamily: "'Montserrat', 'Nunito', sans-serif" }}>
                    Your lessons will appear here
                  </h3>
                  <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#666666' }}>
                    Once you create your first lesson, you'll see it listed here with
                    status, date, and quick access to continue editing.
                  </p>
                  <Link to="/lessons/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Lesson
                    </Button>
                  </Link>
                </div>
              </PolkaDotPanel>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1F2A44', fontFamily: "'Montserrat', 'Nunito', sans-serif" }}>Quick Actions</h2>
          
          <div className="space-y-3">
            <Link to="/templates">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                <GinghamAccent />
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F7DDE2' }}>
                      <FileText className="w-5 h-5" style={{ color: '#C84C4C' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: '#1F2A44' }}>Manage Templates</h3>
                      <p className="text-xs" style={{ color: '#999999' }}>View and update your slide templates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/diagnostics">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                <GinghamAccent />
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E7' }}>
                      <BookCheck className="w-5 h-5" style={{ color: '#6FA86B' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: '#1F2A44' }}>System Diagnostics</h3>
                      <p className="text-xs" style={{ color: '#999999' }}>Troubleshooting and maintenance tools</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="overflow-hidden" style={{ backgroundColor: '#F8FBFF', borderColor: '#CFE3F5' }}>
              <GinghamAccent />
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#CFE3F5' }}>
                    <BookCheck className="w-5 h-5" style={{ color: '#1F2A44' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#1F2A44' }}>Standards Aligned</h3>
                    <p className="text-xs" style={{ color: '#999999' }}>Florida B.E.S.T. Standards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}