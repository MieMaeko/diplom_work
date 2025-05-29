import styles from './styles/builder.module.scss'


export default function BuilderPage () {

    return(
        <div className={styles.builder}>
            <h3>Конструктор тортов</h3>
            <div>
                <div>
                    <p>Форма:</p>
                    <select name="" id="">
                        <option value="">Круг</option>
                        <option value="">Квадрат</option>
                    </select>
                </div>
                <div>
                    <p>Декор:</p>
                    <select name="" id="">
                        <option value="">Без декора</option>
                        <option value="">Пряники</option>
                    </select>
                </div>
                <div>
                    <p>Начинка:</p>
                    <select name="" id="">
                        <option value="">Без начинки</option>
                        <option value="">Морковь</option>
                    </select>
                </div>
                <div>
                    <p>Вес:</p>
                    <select name="" id="">
                        <option value="">1кг</option>
                        <option value="">2кг</option>
                    </select>
                </div>
                <div>
                    <p>Пожелания и дополнения</p>
                    <input type="text" placeholder='Напишите ваши пожелания и предложения'/>
                </div>
                <div>
                    <input type="file" />
                </div>
            </div>
            <button>Отправить на расчёт</button>
            <p>Расчётная сумма (примерная стоимость):</p>
            <p>price</p>
            <p>Предварительная стоимость торта, но нам необходимо уточнить детали.
                Пожалуйста, отправьте данные на расчёт, и наш менеджер свяжется с вами в ближайшее время.
            </p>
        </div>
    )
}