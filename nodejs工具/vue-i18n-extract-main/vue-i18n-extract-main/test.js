var fs__default = require('fs')
var path__default = require('path')

const input = [
  {
    path: "Account.AccountInformation",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "Account",
    language: "index",
  },
  {
    path: "Account.TwiceDoesNotMatch",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "Account",
    language: "index",
  },
  {
    path: "Account.SixToFiftyLength",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "Account",
    language: "index",
  },
  {
    path: "PromptInfo.SixToFiftyLength",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.LoggedOutLogInAgain",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.ConfirmLoggedOut",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.WrongRequest",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.InternalServerProgramError",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.TheServerIsUnable",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.ParameterError",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.PleaseEnterTheCorrectCellPhone",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.PleaseEnterTheCorrectEmail",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.RegistrationHasExpired",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.ActivationFailed",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.ActivationSuccess",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "PromptInfo.WaitServiceRegistration",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "PromptInfo",
    language: "index",
  },
  {
    path: "System.BasicInfoOfAuthorization",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.NumberOfAuthorizedAccessSites",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.NumberOfAuthorizedAccessClients",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.AuthorizationEndDate",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.AuthorizedUse",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.NumberOfSitesCreated",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.NumberOfClientsCreated",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.ChangeRegistrationInfo",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.OperatingEnvironment",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.StandAlone",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.Colony",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.TipRegisteredDate",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.TipExpiredDate",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.TipDueSoonDate",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.UpdateRegistrationcodeDss",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.ActivateServiceDss",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.UpdateRegistrationcodePlatform",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.ActivateServicePlatform",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.UpdateRegistrationcodeOmc",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "System.ActivateServiceOmc",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "System",
    language: "index",
  },
  {
    path: "Organization.AccountId",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "Organization",
    language: "index",
  },
  {
    path: "Organization.OrgName",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "Organization",
    language: "index",
  },
  {
    path: "Partyapp.UpperLimitOfSitesAccess",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "Partyapp",
    language: "index",
  },
  {
    path: "Partyapp.UpperLimitOfTerminalAccess",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "Partyapp",
    language: "index",
  },
  {
    path: "Partyapp.InputUpperLimitOfTerminalAccess",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "Partyapp",
    language: "index",
  },
  {
    path: "Partyapp.InputUpperLimitOfSitesAccess",
    file: "D:/Users/Desktop/vue-i18n-extract-main/vue-i18n-extract-main/tests/fixtures/lang/zh-CN/index.js",
    group: "Partyapp",
    language: "index",
  },
];

const comObject =  {
  Account: {
    AccountInformation: 'Account Information',
    AccountName: 'Username',
    RegistrationTime: 'Registration Time',
    ContactMobile: 'Tel',
    ContactEmail: 'E-mail',
  
    ContactInformation: 'Contact Information',
    Country: 'Country',
    Province: 'Province',
    City: 'City',
    StreetAddress: 'Street Address',
    Telephone: 'Telephone',
    FaxNumber: 'Fax Number',
  
    AccountVerification: 'Account Verification',
    LoginPassword: 'Password',
    MobilePhoneBinding: 'Mobile Phone Binding',
    AlternateMailbox: 'Alternate Email',
    AccountLogin: 'Account Login',
    NumberOfLoginFailures: 'Number Of Login Failures',
    LoginInterval: 'Login Interval',
    LoginRetentionTime: 'Login Online Time',
  
    OriginalPassword: 'Original Password',
    Password: 'Password',
    Confirm: 'Confirm',
    ChangeThePassword: 'Change Password',
    BindingMobilePhone: 'Binding Phone',
    ModifyBindingMobilePhone: 'Modify Binding Phone',
    BindingEmail: 'Binding Email',
    ModifyBindingEmail: 'Modify Binding Email',
    LoginPasswordPromptInfo: 'A password with high security can make the account more secure. It is recommended that you change your password regularly and set a password that contains numbers, letters, and special English characters (`~! @#$%^&*_) with at least 8 digits in length',
    TwiceDoesNotMatch: 'The password entered twice does not match',
    SixToFiftyLength: '6 to 50 characters in length',
    MobilePhoneBindingPromptInfo: 'You have bound your mobile phone {phone} [your mobile phone is a secure mobile phone, you can retrieve your password, but it cannot be used for login]',
    AlternateMailboxPromptInfo: 'You have bound mailbox {email} [password can be retrieved, but not used for login]',
    NumberOfLoginFailuresPromptInfo: 'You can set a limit on the number of failed login attempts (greater than or equal to 3, less than or equal to 6), when the number of failed login attempts reaches the limit, then it takes a certain login interval to log in again, the current setting is {FailuresNumber} times',
    LoginIntervalPromptInfo: 'You can set the time interval (greater than or equal to 5 minutes, less than or equal to 60 minutes) to disable login when the number of failed login attempts reaches the limit, then the login will be disabled within this time interval, the current setting is {loginInterval} minutes',
    LoginRetentionTimePromptInfo: 'You can set the length of time to stay logged in (greater than or equal to 1 hour, less than or equal to 12 hours), after which the system will quit logging in, the current setting is {keepLoginTime} hours'
  },

  PromptInfo: {
    PleaseSelectCountry: 'Please select country',
    PleaseSelectProvince: 'Please select province',
    PleaseSelectCity: 'Please select city',
    PleaseInputStreetAddress: 'Please input street address',
    PleaseInputTelephone: 'Please input the telephone number',
    PleaseInputFaxNumber: 'Please input the fax number',
    PleaseInputTheCorrectTelephone: 'Please input the correct telephone number',
    PleaseInputTheCorrectFaxNumber: 'Please input the correct fax number',
    SaveSuccess: 'Saved successfully',
    PleaseInputTheOriginalPassword: 'Please enter the original password',
    PleaseInputThePassword: 'Please enter password',
    PleaseConfirmYourPassword: 'Please confirm your password',
    PleaseInputPhone: 'Please enter the phone number',
    PleaseInputEmail: 'Please enter your email',
    PleaseInputTheCorrectPhone: 'Please enter the correct phone number',
    PleaseInputTheCorrectEmail: 'Please enter the correct email address',
    ModifySuccess: 'Modified successfully',
    ModifyFailed: 'Modified Failed',
    EMailIsOccupied: 'Email has been occupied',
    TwiceDoesNotMatch: 'The password entered twice does not match',
    SixToFiftyLength: '6 to 50 characters in length',
    EightToFiftyLength: '8 to 50 characters in length',
  
    LoggedOutLogInAgain: 'Your login has expired. Please login again',
    ConfirmLoggedOut: 'Logout confirmation',
    WrongRequest: 'Error Request',
    InternalServerProgramError: 'Internal server program error',
    TheServerIsUnable: "The server is temporarily unable to process the client's request, please try again later.",
    ParameterError: 'Parameter Error',
    PleaseEnterContactCellPhone: 'Please enter the contact phone',
    PleaseEnterYourContactEmail: 'Please enter the contact Email',
    TheAccountNameIsAlreadyOccupied: 'The account name has been occupied',
    PleaseSelectValidPeriod: 'Please select expiration date',
    PleaseEnterTheCorrectCellPhone: 'Please enter the correct phone number',
    PleaseEnterTheCorrectEmail: 'Please enter the correct Email',
    PleaseSelectDate: 'Please select the date',
    SixToTwentyLength: '6 to 20 characters in length',
    DeletedSuccessfully: 'Delete successfully',
    PleaseInput: 'Please enter',
    MovedUnderTheCurrentSystem: 'It can only be moved under the current system',
    MoveSuccessful: 'Move successfully',
    AlreadyExists: 'Already exists',
    UpdateSuccessful: 'Update successfully',
    UpdateFailed: 'Update failed',
    SelectMemberToBeRemoved: 'Please select the member to be removed',
    SelectMemberToBeMovedIn: 'Please select the member to be moved in',
    MoveInSucceeded: 'Move in successfully',
    RemovedSuccessfully: 'Move out successfully',
    MoveInFailed: 'Move in failed',
    PleaseSelect: 'Please select',
    OneToThirtyTwoLength: '1 to 32 characters in length',
    LeasrOneApplicationIsVisible: 'At least one application is visible',
    RoleNameIsAlreadyOccupied: 'The role name has been occupied',
    DepartmentsVannotDeleted: 'There are departments or members under this department, which cannot be deleted',
    ConfirmDeletePage: 'Please confirm whether to delete {page}',
    Tips: 'Tips',
    PleaseInputAccountNumber: 'Please enter the account number',
    PleaseInputPassword: 'Please enter the password',
    AppDeleted: 'The app has been deleted',
    RoleDeleted: 'The role has been deleted',
    DepartmentDeleted: 'The department has been deleted',
    ChangeNumberMembers: 'Changes in the number of members',
    PleaseClickToGenerateIdentificationCode: 'Please click to generate the identification code',
    RegistrationHasExpired: 'The registration has expired or the service has not been registered. Please register again',
    ActivationFailed: 'Registration failed',
    GenerateIdentificationCodeFailed: 'Failed to generate identification code',
    GetBasicInformationFailed: 'Failed to get basic information',
    ObtainAuthorizationUsageFailed: 'Failed to obtain used resources',
    ActivationSuccess: 'Registration success',
    WaitServiceRegistration: 'Getting service registration information, please wait',
    PleaseInputUserName: 'Please input username',
    UserNameIsAlreadyOccupied: 'The username has been occupied',
    PleaseInputTwentyFourCharacters: 'Please enter 24 characters',
    RegistrationFailed: 'Registration failed! The registration code is incorrect. Please re-enter it.',
    batchDelete: 'This operation will download {downloadCount} records, do you want to continue?',
    PleaseSelectData: 'Please select data'
  },

  authority: {
    AddSubsystem: 'Add subsystem',
    System: 'System',
    SuperiorMenu: 'Superior menu',
    Name: 'Name',
    MenuName: 'Menu',
    Contents: 'Contents',
    Route: 'Route',
    Icon: 'Icon',
    Describe: 'Description',
    AddMenu: 'Add menu',
    CreateRole: 'Create role',
    RoleName: 'Role name',
    RoleDescription: 'Role description',
    SupportRoleApplication: 'Authorized application',
    RoleType: 'Role type',
    AuthorizedApplication: 'Application Authorization',
    Visible: 'Visible or not',
    AdvancedUser: 'Advanced user',
    OrdinaryUsers: 'Ordinary users',
    Administrators: 'Administrators',
    HideMenu: 'Hide menu',
    Show: 'Show',
    Hide: 'Hide',
    Number: 'No.',
    SystemDSS: 'Differential Service System',
    SystemDSSIntroduction: 'Support centimeter level high-precision positioning services and millimeter level solution positioning services, providing high-precision real-time positioning data and static post-processing positioning solution data.',
    SystemPlatform: 'Operation and Maintenance Management System',
    SystemPlatformIntroduction: 'Support the operation and maintenance of benchmark stations and terminal accounts, providing the ability to collect data, remote control, firmware upgrade, account application, account approval, and trajectory playback.',
    SystemOMC: 'Operation Monitoring System',
    SystemOMCIntroduction: 'Support comprehensive monitoring of satellites, reference stations, precision networks, terminals, and system applications, as well as anomaly analysis and tracing.',
    IdentificationCode: 'Identification Code',
    AuthorizedUser: 'Authorized User',
    AuthorizationEndDate: 'Authorization end date',
    AvailableResources: 'Available Resources',
    UsedResources: 'Used Resources',
    ProductFeatures: 'Product Features',
    BasicInformation: 'Basic Information',
    BusinessLicense: 'Enterprise tax No.',
    AuthorizationReminder: 'Authorization Reminder',
    Warning: 'Warning',
    Urgent: 'Urgent',
    Ordinary: 'Ordinary',
    StreamsAndTerminalCounts: '{streamCount} data streams and {terminalCount} terminal accounts',
    DssExpiring: 'The authorization for the Differential Service System is about to expire, expiration time',
    DssExpired: 'The authorization for the Differential Service System has expired, expiration time',
    PlatformExpiring: 'The authorization for the Operation and Maintenance Management System is about to expire, expiration time',
    PlatformExpired: 'The authorization for the Operation and Maintenance Management System has expired, expiration time',
    OmcExpiring: 'The authorization for the Operation Monitoring System is about to expire, expiration time',
    OmcExpired: 'The authorization for the Operation Monitoring System has expired, expiration time',
    StreamRemain: 'The resource used by the stream is about to reach the maximum limit, remaining: {streamRemain}',
    StreamLimit: 'The resource used by the stream has reached the maximum limit.',
    TerminalRemain: 'The resource used by the terminal is about to reach the maximum limit, remaining: {terminalRemain}',
    TerminalLimit: 'The resource used by the terminal has reached the maximum limit.'
  },

  System: {
    BasicInfoOfAuthorization: 'Basic information of authorization',
    IdentificationCode: 'Identification Code',
    AuthorizedUser: 'Authorized User',
    NumberOfAuthorizedAccessSites: 'Number of authorized access sites',
    NumberOfAuthorizedAccessClients: 'Number of authorized access users',
    AuthorizationEndDate: 'Authorization end date',
    AuthorizedUse: 'Authorized usage',
    NumberOfSitesCreated: 'Number of sites created',
    NumberOfClientsCreated: 'Number of users created',
    ChangeRegistrationInfo: 'Change authorization registration information',
    RegistrationCode: 'Registration Code',
    Registration: 'Registration',
    BusinessLicense: 'Enterprise tax No.',
    OperatingEnvironment: 'Operating Environment',
    StandAlone: 'stand-alone',
    Colony: 'colony',
    GenerateIdentificationCode: 'Generate',
    TipRegisteredDate: '{dueDate}',
    TipExpiredDate: '{dueDate} (expired)',
    TipDueSoonDate: '{dueDate} (Expiring)',
    UpdateRegistrationcodeDss: 'Update differential service system authorization registration information',
    ActivateServiceDss: 'Activate differential service system',
    UpdateRegistrationcodePlatform: 'Update operation and maintenance management system authorization registration information',
    ActivateServicePlatform: 'Activate operation and maintenance management system',
    UpdateRegistrationcodeOmc: 'Update operation monitoring system authorization registration information',
    ActivateServiceOmc: 'Activate operation monitoring system',
    DssTips: 'Please click on the Generate Identification Code button and send the generated identification code to the system administrator to obtain the registration code. Enter the registration code to complete service registration',
    ModifyBasicInformation: 'Modify Basic Information',
    OpeningDss: 'Congratulations on opening the Differential Service System',
    OpeningPlatform: 'Congratulations on opening the Operation and Maintenance Management System',
    OpeningOmc: 'Congratulations on opening the Operation Monitoring System',
    StreamsAndTerminalCountsTips: '{streamCount} data streams  can be accessed and {terminalCount} terminal accounts can be accessed'
  
  }
  ,

  Operation: {
    Save: 'Save',
    Modify: 'Modify',
    Cancel: 'Cancel',
    Confirm: 'Confirm',
    UpdateAuthorization: 'Update Authorization',
    ActivateNow: 'Activate Now',
    Sure: 'Sure',
    EnterSystemHomepage: 'Enter the system homepage'
  },
  SecuritySet: {
    SecuritySet: 'Security set',
    LimitFailedLogins: 'Limit failed logins',
    LimitFailedLoginsTips: 'Prompt: The number of historical failures will be reset after 24 hours',
    DisableLogonInterval: 'Disable logon interval (minutes)',
    DisableLogonIntervalTips: 'Prompt: When the user fails to log in continuously and reaches the limit, login is prohibited during this time interval',
    PasswordExpirationTime: 'Password expiration time (days)',
    PasswordExpirationTimeTips: 'Prompt: If the user does not update the password during this period, the user password will expire',
    MaximumIdleTimeOfConnection: 'Maximum idle time of connection (minutes)',
    MaximumIdleTimeOfConnectionTips: 'Prompt: If no operation is performed after the configured time, the system will automatically exit',
    PasswordVerificationRules: 'Password verification rules',
    MinimumPasswordLength: 'Minimum password length',
    MustContainEnglish: 'Must contain English letters',
    MustContainNumeric: 'Must contain numeric characters',
    MustContainSpecial: 'Must contain special characters'
  },

  Organization: {
    InputOrgName: 'Please enter the department name',
    AddDepartment: 'Add Department',
    Account: 'Account',
    Department: 'Department',
    PleaseSelectDepartment: 'Please Select Department',
    PleaseSelectRole: 'Please Select Role',
    AddMember: 'Add Member',
    Role: 'Role',
    OrgInfo: 'Organization Information',
    DepartmentInfo: 'Department Information',
    DepartmentName: 'Department',
    ParentDepartment: 'Superior Department',
    Duty: 'Description of responsibilities',
    MemberList: 'Member List',
    MoveInMember: 'Move in members',
    MoveOutMember: 'Move out members',
    PleaseInputAccountName: 'Please enter Member Name / Account ID to search',
    PleaseInputAccountName2: 'Please enter account name',
    AccountId: 'Account ID',
    RoleRange: 'Permission Scope',
    AccountName: 'Account Name',
    OrgName: 'Organization Name',
    CreateTime: 'Create Time',
    ResetPassword: 'Reset Password',
    EditeMember: 'Edit Member',
    PleaseSelectOneUser: 'Please select at least one account',
    DeleteConfirm: 'It cannot be recovered after deletion. Do you want to permanently delete the account',
    ResetPasswordConfirm: 'Reset the account {name} password to {password}?',
    ResetPasswordSuccess: 'Reset Password Successfully',
    ResetPasswordFailed: 'Reset Password Failed',
    OrgDoNotDelete: 'Organization cannot be deleted',
    DeleteDepartmentAsk: 'Whether to permanently delete the department',
    ValidPeriod: 'Expiration Date',
    ContactMobile: 'Tel',
    ContactEmail: 'E-mail',
    BelongingDepartment: 'Department',
    ViewAddModifyDownloadDeleteApprove: 'view, add, modify, download, delete , audit'
  }
  ,
  Partyapp: {
    UserName: 'User Name',
    Remarks: 'Remarks',
    PleaseSelectOneUser: 'Please select at least one user',
    DeleteConfirm: 'It cannot be recovered after deletion. Do you want to permanently delete the user',
    AuthorizationModule: 'Authorization Module',
    UpperLimitOfSitesAccess: 'Upper limit of sites access',
    UpperLimitOfAccess: 'Upper limit of access',
    UpperLimitOfTerminalAccess: 'Upper limit of terminal access',
    InputUpperLimitOfTerminalAccess: 'Please enter the upper limit of terminal access',
    InputUpperLimitOfSitesAccess: 'Please enter the upper limit of sites access'
  },
}

function gorunp(data){
  const inputMap = new Map()
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    if (!inputMap.has(item.group)) {
      inputMap.set(item.group, [item])
    } else {
      const inputMapData = inputMap.get(item.group)
      inputMapData.push(item)
    }
  }
  return [...inputMap.values()]
}
const grounpData = gorunp(input)
// console.log(grounpData);

grounpData.forEach(item => {
  const comObjectItem = comObject[item[0].group]
  // console.log(comObjectItem);
  const inputItem = item
  comFun(comObjectItem, inputItem)
})

function comFun(comObjectItem, inputItem) {
  const res = {}
  const group = inputItem[0].group
  for (const key in comObjectItem) {
    if(!inputItem.find(item => item.path === (group + '.' + key))) {
      res[key] = comObjectItem[key];
    }
  }
  writeReportToFile(res, path__default.resolve(process.cwd()+'\\lang', './'+ group + '.js'))
}

function writeReportToFile (report, writePath) {
  const reportString = JSON.stringify(report);
  return new Promise((resolve, reject) => {
    fs__default.writeFile(
      writePath,
      reportString,
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      },
    );
  });
}