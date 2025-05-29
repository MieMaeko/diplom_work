
const categoryTranslations: { [key: string]: string } = {
    child: "Детские",
    biscuit: "Бисквитные",
    wedding: "Свадебные",
    gravit: "Антигравитация",
    ball: "В шаре",
    muss: "Муссовые",
    others: "Другие",
    cupcakes:"Капкейки",
    pies:"Пирожные",
    kuliches:"Куличи",
    sets:"Сеты",
    desserts:"Десерты",
    rulets:"Рулеты",
    breads:"Пряники"
  };
interface TranslateProps {
    translation: string;
  }
export default function CategorTranslate({translation}:TranslateProps){
    return (
        <span>{categoryTranslations[translation]}</span>
    )
}