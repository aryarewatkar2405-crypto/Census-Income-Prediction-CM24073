/**
 * Exact feature categories & presets extracted from the Phase 1 trained model
 */

export const CATEGORICAL_OPTIONS = {
  workclass: [
    'Private',
    'Self-emp-not-inc',
    'Self-emp-inc',
    'Federal-gov',
    'Local-gov',
    'State-gov',
    'Without-pay',
    'Never-worked'
  ],
  education: [
    'Bachelors',
    'Some-college',
    '11th',
    'HS-grad',
    'Prof-school',
    'Assoc-acdm',
    'Assoc-voc',
    '9th',
    '7th-8th',
    '12th',
    'Masters',
    '1st-4th',
    '10th',
    'Doctorate',
    '5th-6th',
    'Preschool'
  ],
  'marital-status': [
    'Married-civ-spouse',
    'Divorced',
    'Never-married',
    'Separated',
    'Widowed',
    'Married-spouse-absent',
    'Married-AF-spouse'
  ],
  occupation: [
    'Exec-managerial',
    'Prof-specialty',
    'Craft-repair',
    'Adm-clerical',
    'Sales',
    'Other-service',
    'Machine-op-inspct',
    'Transport-moving',
    'Handlers-cleaners',
    'Farming-fishing',
    'Tech-support',
    'Protective-serv',
    'Priv-house-serv',
    'Armed-Forces'
  ],
  relationship: [
    'Husband',
    'Not-in-family',
    'Own-child',
    'Unmarried',
    'Wife',
    'Other-relative'
  ],
  race: [
    'White',
    'Black',
    'Asian-Pac-Islander',
    'Amer-Indian-Eskimo',
    'Other'
  ],
  sex: [
    'Male',
    'Female'
  ],
  'native-country': [
    'United-States',
    'Mexico',
    'Philippines',
    'Germany',
    'Canada',
    'Puerto-Rico',
    'El-Salvador',
    'India',
    'Cuba',
    'England',
    'China',
    'South',
    'Jamaica',
    'Italy',
    'Dominican-Republic',
    'Japan',
    'Guatemala',
    'Poland',
    'Vietnam',
    'Columbia',
    'Haiti',
    'Portugal',
    'Taiwan',
    'Iran',
    'Greece',
    'Nicaragua',
    'Peru',
    'Ecuador',
    'France',
    'Ireland',
    'Hong',
    'Thailand',
    'Cambodia',
    'Trinadad&Tobago',
    'Laos',
    'Yugoslavia',
    'Outlying-US(Guam-USVI-etc)',
    'Hungary',
    'Honduras',
    'Scotland',
    'Holand-Netherlands'
  ]
};

export const EDUCATION_NUM_MAP = {
  'Preschool': 1,
  '1st-4th': 2,
  '5th-6th': 3,
  '7th-8th': 4,
  '9th': 5,
  '10th': 6,
  '11th': 7,
  '12th': 8,
  'HS-grad': 9,
  'Some-college': 10,
  'Assoc-voc': 11,
  'Assoc-acdm': 12,
  'Bachelors': 13,
  'Masters': 14,
  'Prof-school': 15,
  'Doctorate': 16
};

export const SAMPLE_PRESETS = [
  {
    name: 'Standard Income (<=50K Expected)',
    badgeColor: 'blue',
    data: {
      age: 38,
      workclass: 'Private',
      fnlwgt: 89814,
      education: 'HS-grad',
      'education-num': 9,
      'marital-status': 'Married-civ-spouse',
      occupation: 'Farming-fishing',
      relationship: 'Husband',
      race: 'White',
      sex: 'Male',
      'capital-gain': 0,
      'capital-loss': 0,
      'hours-per-week': 50,
      'native-country': 'United-States'
    }
  },
  {
    name: 'High Income (>50K Expected)',
    badgeColor: 'emerald',
    data: {
      age: 45,
      workclass: 'Private',
      fnlwgt: 180000,
      education: 'Bachelors',
      'education-num': 13,
      'marital-status': 'Married-civ-spouse',
      occupation: 'Exec-managerial',
      relationship: 'Husband',
      race: 'White',
      sex: 'Male',
      'capital-gain': 15000,
      'capital-loss': 0,
      'hours-per-week': 55,
      'native-country': 'United-States'
    }
  },
  {
    name: 'Young Graduate (<=50K Expected)',
    badgeColor: 'purple',
    data: {
      age: 24,
      workclass: 'Private',
      fnlwgt: 195000,
      education: 'Bachelors',
      'education-num': 13,
      'marital-status': 'Never-married',
      occupation: 'Tech-support',
      relationship: 'Own-child',
      race: 'White',
      sex: 'Female',
      'capital-gain': 0,
      'capital-loss': 0,
      'hours-per-week': 40,
      'native-country': 'United-States'
    }
  }
];
