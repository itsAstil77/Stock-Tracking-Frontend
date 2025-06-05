// import { Routes } from '@angular/router';
// import { Login } from './components/pages/login/login/login';
// import { Otp } from './components/pages/otp/otp/otp';
// import { Navbar } from './components/navbar/navbar/navbar';
// import { Dashboard } from './components/pages/dashboard/dashboard/dashboard';
// import { CompareExcel } from './components/pages/compare-excel/compare-excel/compare-excel';
// import { ScanCreator } from './components/pages/scan-creator/scan-creator/scan-creator';

// export const routes: Routes = [
//     {
//         path: '',
//         redirectTo: '/login',
//         pathMatch: 'full'
//     },
//     {
//         path: 'login',
//         component: Login
//     },

//     {
//         path: 'otp',
//         component: Otp
//     },
//     {
//         path: '',
//         component: Navbar,
//         children: [
//             { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default: Dashboard
//             { path: 'dashboard', component: Dashboard },
//             { path: 'compare-excel', component: CompareExcel },
//         { path: 'scan-creator', component: ScanCreator }
//         ]
//     }
// ];



import { Routes } from '@angular/router';
import { Login } from './components/pages/login/login/login';
import { Otp } from './components/pages/otp/otp/otp';
import { Navbar } from './components/navbar/navbar/navbar';
import { Dashboard } from './components/pages/dashboard/dashboard/dashboard';
import { CompareExcel } from './components/pages/compare-excel/compare-excel/compare-excel';
import { ScanCreator } from './components/pages/scan-creator/scan-creator/scan-creator';
import { UserManagement } from './components/pages/user-management/user-management/user-management';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'otp',
    component: Otp
  },
  {
    path: '',
    component: Navbar,
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'compare-excel',
        component: CompareExcel
      },
      {
        path: 'scan-creator',
        component: ScanCreator
      },
            {
        path: 'user-management',
        component: UserManagement
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login' // fallback route
  }
];


// import { Routes } from '@angular/router';
// import { Login } from './components/pages/login/login/login';
// import { Otp } from './components/pages/otp/otp/otp';
// import { Navbar } from './components/navbar/navbar/navbar';
// import { Dashboard } from './components/pages/dashboard/dashboard/dashboard';
// import { CompareExcel } from './components/pages/compare-excel/compare-excel/compare-excel';
// import { ScanCreator } from './components/pages/scan-creator/scan-creator/scan-creator';

// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', component: Login },
//   { path: 'otp', component: Otp },
//   {
//     path: '',
//     component: Navbar,
//     children: [
//       { path: 'dashboard', component: Dashboard },
//        { path: 'compare-excel', component: CompareExcel },
//         { path: 'scan-creator', component: ScanCreator }
//     ]
//   }
// ];
