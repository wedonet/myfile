dim hkey_root,hkey_path,hkey_key 
hkey_root="HKEY_CURRENT_USER" 
hkey_path="\Software\Microsoft\Internet Explorer\PageSetup" 
'//������ҳ��ӡ��ҳüҳ��Ϊ�� 
function pagesetup_null() 
    on error resume next 
    Set RegWsh = CreateObject("WScript.Shell") 
    hkey_key="\header"     
    RegWsh.RegWrite hkey_root+hkey_path+hkey_key,"" 
    hkey_key="\footer" 
    RegWsh.RegWrite hkey_root+hkey_path+hkey_key,"" 
	
end function 
'//������ҳ��ӡ��ҳüҳ��ΪĬ��ֵ 
function pagesetup_default() 
    on error resume next 
    Set RegWsh = CreateObject("WScript.Shell") 
    hkey_key="\header"     
    RegWsh.RegWrite hkey_root+hkey_path+hkey_key,"&w&bҳ�룬&p/&P" 
    hkey_key="\footer" 
    RegWsh.RegWrite hkey_root+hkey_path+hkey_key,"&u&b&d" 
end function 

