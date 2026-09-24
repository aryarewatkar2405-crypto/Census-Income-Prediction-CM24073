import React, { useState } from 'react';
import {
  CATEGORICAL_OPTIONS,
  EDUCATION_NUM_MAP,
  SAMPLE_PRESETS
} from '../data/featureOptions';
import {
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  DollarSign,
  AlertCircle
} from 'lucide-react';

const INITIAL_FORM_STATE = {
  age: 38,
  workclass: 'Private',
  fnlwgt: 89814,
  education: 'HS-grad',
  'education-num': 9,
  'marital-status': 'Married-civ-spouse',
  occupation: 'Exec-managerial',
  relationship: 'Husband',
  race: 'White',
  sex: 'Male',
  'capital-gain': 0,
  'capital-loss': 0,
  'hours-per-week': 40,
  'native-country': 'United-States'
};

export default function PredictionForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    let parsedValue = value;

    if (['age', 'fnlwgt', 'education-num', 'capital-gain', 'capital-loss', 'hours-per-week'].includes(field)) {
      parsedValue = value === '' ? '' : Number(value);
    }

    if (field === 'education' && EDUCATION_NUM_MAP[value]) {
      setFormData(prev => ({
        ...prev,
        education: value,
        'education-num': EDUCATION_NUM_MAP[value]
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: parsedValue
    }));

    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const applyPreset = (preset) => {
    setFormData(preset.data);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.age || formData.age < 17 || formData.age > 100) {
      errors.age = 'Age must be between 17 and 100.';
    }
    if (!formData['hours-per-week'] || formData['hours-per-week'] < 1 || formData['hours-per-week'] > 100) {
      errors['hours-per-week'] = 'Hours per week must be between 1 and 100.';
    }
    if (formData['capital-gain'] < 0) {
      errors['capital-gain'] = 'Capital gain cannot be negative.';
    }
    if (formData['capital-loss'] < 0) {
      errors['capital-loss'] = 'Capital loss cannot be negative.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="white-card">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F172A' }}>
          <Sparkles size={20} color="#2563EB" />
          <span>Income Prediction Form</span>
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '0.2rem' }}>
          Provide demographic and employment parameters to predict the income bracket.
        </p>
      </div>

      {/* Preset Quick Fill Buttons */}
      <div className="presets-bar">
        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>Quick Presets:</span>
        {SAMPLE_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            className="preset-btn"
            onClick={() => applyPreset(preset)}
          >
            <span>{preset.name}</span>
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#DC2626',
          fontSize: '0.88rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Section 1: Demographics */}
        <div className="form-section-title">
          <User size={18} color="#2563EB" />
          <span>1. Demographics</span>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Age (years)</label>
            <input
              type="number"
              className="form-input"
              value={formData.age}
              min="17"
              max="100"
              required
              onChange={(e) => handleInputChange('age', e.target.value)}
            />
            {formErrors.age && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors.age}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              value={formData.sex}
              onChange={(e) => handleInputChange('sex', e.target.value)}
            >
              {CATEGORICAL_OPTIONS.sex.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Race / Ethnicity</label>
            <select
              className="form-select"
              value={formData.race}
              onChange={(e) => handleInputChange('race', e.target.value)}
            >
              {CATEGORICAL_OPTIONS.race.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Native Country</label>
            <select
              className="form-select"
              value={formData['native-country']}
              onChange={(e) => handleInputChange('native-country', e.target.value)}
            >
              {CATEGORICAL_OPTIONS['native-country'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        {/* Section 2: Education */}
        <div className="form-section-title">
          <GraduationCap size={18} color="#2563EB" />
          <span>2. Education</span>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Highest Education Level</label>
            <select
              className="form-select"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
            >
              {CATEGORICAL_OPTIONS.education.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Education Numeric Years (1 - 16)</label>
            <input
              type="number"
              className="form-input"
              value={formData['education-num']}
              min="1"
              max="16"
              required
              onChange={(e) => handleInputChange('education-num', e.target.value)}
            />
          </div>
        </div>

        {/* Section 3: Work & Employment */}
        <div className="form-section-title">
          <Briefcase size={18} color="#2563EB" />
          <span>3. Employment & Work</span>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Work Sector (Workclass)</label>
            <select
              className="form-select"
              value={formData.workclass}
              onChange={(e) => handleInputChange('workclass', e.target.value)}
            >
              {CATEGORICAL_OPTIONS.workclass.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Occupation</label>
            <select
              className="form-select"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
            >
              {CATEGORICAL_OPTIONS.occupation.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Working Hours / Week</label>
            <input
              type="number"
              className="form-input"
              value={formData['hours-per-week']}
              min="1"
              max="100"
              required
              onChange={(e) => handleInputChange('hours-per-week', e.target.value)}
            />
            {formErrors['hours-per-week'] && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>{formErrors['hours-per-week']}</span>}
          </div>
        </div>

        {/* Section 4: Household & Financials */}
        <div className="form-section-title">
          <DollarSign size={18} color="#2563EB" />
          <span>4. Financial & Household</span>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Marital Status</label>
            <select
              className="form-select"
              value={formData['marital-status']}
              onChange={(e) => handleInputChange('marital-status', e.target.value)}
            >
              {CATEGORICAL_OPTIONS['marital-status'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Relationship to Household</label>
            <select
              className="form-select"
              value={formData.relationship}
              onChange={(e) => handleInputChange('relationship', e.target.value)}
            >
              {CATEGORICAL_OPTIONS.relationship.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Capital Gain ($)</label>
            <input
              type="number"
              className="form-input"
              value={formData['capital-gain']}
              min="0"
              onChange={(e) => handleInputChange('capital-gain', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Capital Loss ($)</label>
            <input
              type="number"
              className="form-input"
              value={formData['capital-loss']}
              min="0"
              onChange={(e) => handleInputChange('capital-loss', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Census Weight (fnlwgt)</label>
            <input
              type="number"
              className="form-input"
              value={formData.fnlwgt}
              min="0"
              onChange={(e) => handleInputChange('fnlwgt', e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ marginTop: '0.5rem' }}
        >
          {loading ? (
            <>
              <div className="spinner" />
              <span>Predicting Income...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Predict Income Category</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
