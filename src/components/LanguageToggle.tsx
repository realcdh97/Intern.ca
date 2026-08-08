import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localizedLanguageNames, languageFlags, Language } from "@/translations/dictionary";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  // Dynamic alphabetical sort based on the current base language preference
  const sortedLanguages = (Object.keys(localizedLanguageNames) as Language[]).sort((a, b) => {
    const nameA = localizedLanguageNames[language][a] || "";
    const nameB = localizedLanguageNames[language][b] || "";
    return nameA.localeCompare(nameB, language);
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 gap-2 rounded-md border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground flex items-center"
          title="Switch Language"
        >
          {languageFlags[language] ? (
            <img
              src={languageFlags[language]}
              alt=""
              className="h-3.5 w-5 object-cover rounded-sm border border-muted/30"
            />
          ) : (
            <span className="text-sm">🌐</span>
          )}
          <span className="font-semibold text-xs tracking-wider uppercase">
            {language}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[350px] overflow-y-auto w-56">
        {sortedLanguages.map((lang) => {
          const translatedName = localizedLanguageNames[language][lang];
          const nativeName = localizedLanguageNames[lang][lang];
          
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`cursor-pointer justify-between items-center gap-2 ${
                language === lang ? "bg-accent font-semibold text-accent-foreground" : ""
              }`}
            >
              <div className="flex items-center gap-2 max-w-[80%] truncate">
                {languageFlags[lang] ? (
                  <img
                    src={languageFlags[lang]}
                    alt=""
                    className="h-3.5 w-5 object-cover flex-shrink-0 rounded-sm border border-muted/30"
                  />
                ) : (
                  <span className="text-sm flex-shrink-0">🌐</span>
                )}
                <span className="truncate">
                  {translatedName}
                  {translatedName !== nativeName && (
                    <span className="text-[11px] text-muted-foreground ml-1.5 font-normal">
                      ({nativeName})
                    </span>
                  )}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase flex-shrink-0">{lang}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
