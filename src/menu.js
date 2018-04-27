export default [
    { 'header': 'Technical Screening' },
    // { 'href': '/', 'title': 'Home', 'icon': 'home' },
    // { 'href': '/crud/types', 'title': 'Types', 'icon': 'view_list' },
    { 'href': '/tests/gridtest', 'title': 'Tests', 'icon': 'format_list_bulleted' },
    { 'href': '/tests/formtest', 'title': 'Create Test', 'icon': 'note_add' },
    { 'href': '/affectedtests/affecttest', 'title': 'Affected Test', 'icon': 'today' },
    { 'href': '/affectedtests/gridaffect', 'title': 'Affect Test', 'icon': 'insert_invitation' },
    { 'href': '/candidates/formcandidate', 'title': 'Add Candidate', 'icon': 'person_add' },
    { 'href': '/candidates/gridcandidates', 'title': 'Candidates', 'icon': 'people' },
    { 'href': '/assessments/formassessment', 'title': 'Create Assessment', 'icon': 'assignment_ind' },
    { 'href': '/assessments/gridassessments', 'title': 'Assessments', 'icon': 'assignment' },

    // { 'href': '/crud/comments', 'title': 'Comments', 'icon': 'view_list' },
    // { 'href': '/crud/users', 'title': 'Users', 'icon': 'people' },
  
    { divider: true, 'role': 'Admin'},
    { 'header': 'Adminstration', 'role': 'Admin' },
    {
        'title': 'Organisation Users',
        'icon': 'domain',
        'items': [
          { 'href': '/users/formuser', 'title': 'Add a new Organisation user' },
          { 'href': '/about', 'title': 'Organisation users' }
        ],
        // 'role': 'Admin'
    },
    // { 'href': '/settings', 'title': 'Settings', 'icon': 'settings' },
  
    { 'href': '/login', 'icon': 'lock', 'title': 'Logout' }
]  