<!-- : ************************************************************************
@echo off & setlocal enableextensions enabledelayedexpansion & set "_bang=^!"
rem ***************************************************************************
rem *                                                                         *
rem * Copyright (C) 2025 BitCtrl Systems GmbH                                 *
rem *                                                                         *
rem * runall.cmd                                                              *
rem *                                                                         *
rem * @author   Daniel Hammerschmidt <daniel.hammerschmidt@bitctrl.de>        *
rem * @version  20251041                                                      *
rem *                                                                         *
rem ***************************************************************************

goto __main__

:_sub_clear_env
:_sub_clear_env
for /f "usebackq tokens=1 delims==" %%K in (`set`) do (
  for /f "usebackq tokens=1 delims=_" %%a in (':%%K') do (
    if "%%a" == ":" set "%%K="
  )
)
exit /b

:_sub_run
:_sub_run
for /f "usebackq tokens=*" %%D in ('!CD!') do for /f "usebackq tokens=*" %%N in ('%%~nD') do (
  for /d %%I in ("%%D\%~1") do for /f "usebackq tokens=*" %%A in ('%%~I\%%~N-%%~nI') do (
    rmdir "%%~I" 2> nul && mkdir "%%~I" && copy /y "%%~D\_%%~N.exe_" "%%~A.exe" > nul && echo. > nul 2> "%%~A.msh"
    if exist "%%~A.exe" if exist "%%~A.msh" (
      copy /y "%%~D\_%%~N.msh" "%%~A.msh" > nul
      if exist "%%~D\_%%~N.proxy" (
        copy /y "%%~D\_%%~N.proxy" "%%~A.proxy" > nul 2>&1
      ) else (
        del "%%~A.proxy" > nul 2>&1
      )
      setlocal
      call :_sub_clear_env
      @rem escape in double-dash for valid xml-comment
      start "%%~nA" /d "%%~I" %%~nA.exe run -^-agentName="%%~nA" -^-meshServiceName="%%~nA"
      endlocal
    )
  )
)
exit /b

:_lbl_runall
:_lbl_runall
call :_sub_run "*"
exit /b

:_lbl_runone
:_lbl_runone
for /l %%I in (2,1,%_argc%) do for %%N in ("!_argv[%%I]!") do call :_sub_run "%%~nN"
exit /b

:_lbl_killall
:_lbl_killall
for /f "usebackq tokens=*" %%D in ('!CD!') do for /f "usebackq tokens=*" %%N in ('%%~nD') do (
  for /d %%I in ("%%D\*") do for /f "usebackq tokens=*" %%A in ('%%~I\%%~N-%%~nI') do (
    if exist "%%~A.exe" if exist "%%~A.msh" (
      taskkill -f -im "%%~nA.exe"
    )
  )
)
exit /b

:__main__
:__main__
whoami /user /fo list | findstr /i /r /c:"^SID: *S-1-5-18$" > nul 2>&1 || (
  net session > nul 2>&1 || (
    sc query surunsvc | findstr /i /r /c:"^ *state *: *4 *running *$" > nul 2>&1 && (
      surun "%~f0" %*
      exit /b
    )
    set "_286913E2_3B6C_4EFF_8F7B_C4EFB98FCCD5=%*"
    cscript //nologo "%~f0?.wsf" //job:elevate "%~f1"
    exit /b
  )
  psexec -nobanner -accepteula -sid cmd /d /s /c ""%~f0" %*"
  exit /b
)
set _argc=0
for %%x in (%*) do set /a "_argc+=1" & set "_argv[!_argc!]=%%~x"
cd %~dp0
if "%~1" == "" goto _lbl_runall
goto _lbl_%~1


exit /b & rem ************************************************************* -->
<package><job></job>
<job id="elevate"><script language="JScript">
var wshsh = new ActiveXObject( 'WScript.Shell' );
var shapp = new ActiveXObject( 'Shell.Application' );
var cmd = wshsh.ExpandEnvironmentStrings( '%COMSPEC%' );
var args = wshsh.ExpandEnvironmentStrings( '%_286913E2_3B6C_4EFF_8F7B_C4EFB98FCCD5%' );
var name = WScript.ScriptFullName.match( /^(.*)\?(?:\.wsf)?$/ )[ 1 ];
shapp.ShellExecute( cmd, '/d /s /c ""' + name + '" ' + args + '"', undefined, 'runas', 1 );
</script></job>
</package>
