import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, ExternalLink } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  currentAmount: number;
  progressPercent: number;
  coverImageUrl?: string;
  status: string;
  _count?: { donations: number };
}

const CATEGORY_LABELS: Record<string, string> = {
  relief:         '🆘 إغاثة',
  education:      '📚 تعليم',
  medical:        '🏥 طبي',
  sponsorship:    '🧒 كفالة',
  infrastructure: '🏗️ بنية',
  other:          '🌍 أخرى',
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const remaining = Number(project.goalAmount) - Number(project.currentAmount);

  return (
    <div
      className="card"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* صورة المشروع */}
      <div style={{
        height:   '220px',
        background: project.coverImageUrl
          ? `url(${project.coverImageUrl}) center/cover no-repeat`
          : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
        position: 'relative',
        flexShrink: 0,
      }}>
        <span style={{
          position:     'absolute',
          top:          '12px',
          right:        '12px',
          background:   'rgba(255,255,255,0.95)',
          padding:      '0.3rem 0.85rem',
          borderRadius: '999px',
          fontSize:     '0.8rem',
          fontWeight:   700,
          color:        'var(--color-primary)',
          boxShadow:    '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {CATEGORY_LABELS[project.category] || project.category}
        </span>

        {project.status === 'completed' && (
          <span style={{
            position:   'absolute',
            top:        '12px',
            left:       '12px',
            background: 'var(--color-secondary)',
            color:      '#fff',
            padding:    '0.3rem 0.85rem',
            borderRadius: '999px',
            fontSize:   '0.8rem',
            fontWeight: 700,
            boxShadow:  '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            ✅ مكتمل
          </span>
        )}
      </div>

      {/* محتوى البطاقة */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontSize:     '1.2rem',
          fontWeight:   800,
          color:        'var(--color-primary)',
          marginBottom: '0.5rem',
          lineHeight:   1.4,
        }}>
          {project.title}
        </h3>
        <p style={{
          fontSize:   '0.9rem',
          color:      '#6B7280',
          lineHeight: 1.6,
          marginBottom: '1rem',
          flex:       1,
          overflow:   'hidden',
          display:    '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {project.description}
        </p>

        {/* شريط التقدم */}
        <div style={{ marginBottom: '1rem', background: '#F9FAFB', padding: '0.8rem', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-secondary-dark)', fontWeight: 800 }}>
              <TrendingUp size={14} style={{ display: 'inline', marginLeft: '4px' }} />
              {project.progressPercent}% مكتمل
            </span>
            <span style={{ fontSize: '0.85rem', color: '#4B5563', fontWeight: 600 }}>
              ${Number(project.currentAmount).toLocaleString()} / ${Number(project.goalAmount).toLocaleString()}
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: '#6B7280' }}>
          <span style={{ fontWeight: 500 }}>
            <Users size={14} style={{ display: 'inline', marginLeft: '4px', color: 'var(--color-primary)' }} />
            {project._count?.donations || 0} متبرع
          </span>
          <span style={{ color: remaining > 0 ? '#E74C3C' : 'var(--color-secondary)', fontWeight: 800 }}>
            {remaining > 0 ? `المتبقي: $${Number(remaining).toLocaleString()}` : '🎉 اكتمل التمويل'}
          </span>
        </div>

        {/* أزرار الإجراءات */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href={`/donate?project=${project.id}`}
            className="btn btn-donate"
            style={{ flex: 1, fontSize: '0.95rem', padding: '0.6rem' }}
          >
            🤲 تبرع الآن
          </a>
          <Link
            to={`/projects/${project.id}`}
            style={{
              padding:     '0.6rem 1rem',
              border:      '2px solid #E0E0E0',
              borderRadius: '10px',
              color:       '#6B7280',
              display:     'flex',
              alignItems:  'center',
              gap:         '0.25rem',
              fontSize:    '0.85rem',
              transition:  'all 0.2s',
            }}
          >
            <ExternalLink size={16} />
            تفاصيل
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
