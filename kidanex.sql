-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2026 at 03:27 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kidanex`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password_hash`) VALUES
(1, 'samanbalahang', '$2b$12$pKYnCOt2aiMJU5UejoxKmesNb6wgIaZWYbeAfFlCzmhkwZmDZWRei');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `slug` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `slug`) VALUES
(2, 'ourteam'),
(1, 'services');

-- --------------------------------------------------------

--
-- Table structure for table `category_translations`
--

CREATE TABLE `category_translations` (
  `category_id` int(11) NOT NULL,
  `lang` char(2) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category_translations`
--

INSERT INTO `category_translations` (`category_id`, `lang`, `name`) VALUES
(1, 'ar', 'خدمات'),
(1, 'en', 'Services'),
(1, 'fa', 'خدمات'),
(2, 'ar', 'فريقنا'),
(2, 'en', 'Our Team'),
(2, 'fa', 'تیم ما');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `name` varchar(255) NOT NULL,
  `run_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`name`, `run_at`) VALUES
('001_create_services.sql', '2026-10-15 19:07:05'),
('002_create_admins.sql', '2026-10-15 19:07:05'),
('003_content.sql', '2026-10-15 20:35:49'),
('004_shop.sql', '2026-10-26 18:09:20');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `type` enum('page','post') NOT NULL DEFAULT 'post',
  `slug` varchar(100) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(30) NOT NULL DEFAULT '',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `status` enum('draft','published') NOT NULL DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `type`, `slug`, `image`, `phone`, `sort_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 'page', 'about', '', '', 0, 'published', '2026-10-19 19:55:41', '2026-10-19 19:55:41'),
(2, 'post', 'cardboard', '/images/202610/1830ce86e0098774.webp', '', 0, 'published', '2026-10-23 16:13:26', '2026-10-23 16:22:32'),
(3, 'post', 'consulting', '/images/202610/96ed8fae9e41583d.webp', '', 0, 'published', '2026-10-23 16:27:02', '2026-10-23 16:27:02'),
(4, 'post', 'trading', '/images/202610/43f9f4fef23825a8.webp', '', 0, 'published', '2026-10-23 16:30:30', '2026-10-23 16:30:30'),
(5, 'post', 'dastyar', '/images/202610/23447c33820244af.webp', '+98 912 461 8670', 0, 'published', '2026-10-23 16:58:07', '2026-10-23 16:58:07'),
(6, 'post', 'kiany', '/images/202610/395c19d8a6aea93f.webp', '+98 912 567 3199', 0, 'published', '2026-10-23 17:01:29', '2026-10-23 17:01:29');

-- --------------------------------------------------------

--
-- Table structure for table `post_categories`
--

CREATE TABLE `post_categories` (
  `post_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_categories`
--

INSERT INTO `post_categories` (`post_id`, `category_id`) VALUES
(2, 1),
(3, 1),
(4, 1),
(5, 2),
(6, 2);

-- --------------------------------------------------------

--
-- Table structure for table `post_tags`
--

CREATE TABLE `post_tags` (
  `post_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post_translations`
--

CREATE TABLE `post_translations` (
  `post_id` int(11) NOT NULL,
  `lang` char(2) NOT NULL,
  `title` varchar(255) NOT NULL,
  `summary` text NOT NULL,
  `body` mediumtext NOT NULL,
  `points` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`points`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_translations`
--

INSERT INTO `post_translations` (`post_id`, `lang`, `title`, `summary`, `body`, `points`) VALUES
(1, 'ar', 'نبذة عن كيدانكس', 'شركة Kidanx هي شركة قابضة متعددة التخصصات تعمل في مجالات متنوعة، بما في ذلك الإنتاج الصناعي والتسويق وتطوير الأعمال والتجارة المحلية والدولية وتوريد السلع والتصدير والاستشارات الإدارية.', '<p>كيدانكس هي <strong>مجموعة تجارية متنوعة الأنشطة</strong> تعمل في قطاعات متعددة، تشمل التصنيع الصناعي، والتسويق وتطوير الأعمال، والتجارة المحلية والدولية، وتوريد المنتجات، والتصدير، والاستشارات الإدارية. نسعى إلى بناء فرص تجارية مستدامة، وتعزيز الشراكات المهنية، وتوفير منتجات وخدمات موثوقة للشركات في الأسواق المحلية والدولية.</p><p>تمتد أنشطة كيدانكس عبر مجموعة واسعة من القطاعات، بدءًا من <strong>تصنيع وتغليف الكرتون</strong> والتسويق الصناعي، وصولًا إلى توريد وتجارة المنتجات الزراعية ومستحضرات التجميل والعناية الشخصية، بالإضافة إلى مختلف أنواع السلع التي تلبي احتياجات الأسواق. ومن خلال شبكة من المصنّعين والمورّدين والشركاء التجاريين، نعمل على تسهيل وصول الشركات إلى المنتجات عالية الجودة، والفرص السوقية الجديدة، والحلول التجارية الفعّالة.</p><h3><strong>١. التصنيع الصناعي وصناعة عبوات الكرتون</strong></h3><p>تعمل كيدانكس في قطاع صناعة وتغليف الكرتون، و<strong>تمتلك مصنعًا لإنتاج الكرتون</strong>، حيث تقدم منتجات التغليف التي تلبي احتياجات الشركات والقطاعات المختلفة. ونركز على جودة المنتجات، وموثوقية التوريد، والقدرة على تلبية المتطلبات المتنوعة لعملائنا.</p><p>ولا تقتصر أنشطتنا في هذا القطاع على التصنيع فحسب، بل نقدم أيضًا خدمات <strong>التسويق وتطوير الأسواق</strong> لعدد من أكبر مصانع الكرتون في القطاع. وتهدف هذه الشراكات إلى توسيع قاعدة العملاء، وتعزيز شبكات المبيعات، وزيادة الحضور في الأسواق، وخلق فرص تجارية جديدة للمصنّعين.</p><p>ومن خلال الربط بين القدرات الإنتاجية واحتياجات السوق، نساعد المصنّعين على الوصول إلى مزيد من العملاء، وتعزيز مبيعاتهم، وتوسيع نطاق أعمالهم بصورة مستدامة.</p><h3><strong>٢. التسويق وتطوير الأسواق وتنمية الأعمال</strong></h3><p>يُعد <strong>التسويق وتطوير الأسواق</strong> من المجالات الأساسية ضمن أنشطة كيدانكس. نتعاون مع المصنّعين والمصانع والشركات العاملة في قطاعات متنوعة، بهدف إيجاد فرص جديدة لتسويق المنتجات، واستقطاب العملاء، وتوسيع نطاق المبيعات.</p><p>تشمل خدماتنا في هذا المجال تحديد الأسواق المستهدفة، وبناء قنوات التواصل بين المصنّعين والمشترين، وتوسيع شبكات العملاء، والترويج للمنتجات، والمساهمة في تنمية الأنشطة التجارية.</p><p>وإلى جانب تطوير أسواق منتجاتنا، تعمل كيدانكس على تسويق منتجات الشركات الشريكة أيضًا. ويساعد هذا النهج الشركات على الاستفادة من الفرص التجارية المتاحة، وتوسيع علاقاتها المهنية، وتعزيز قدرتها على الوصول إلى عملاء جدد وتحقيق نمو أكبر في المبيعات.</p><h3><strong>٣. توريد وتجارة المنتجات الزراعية</strong></h3><p>يمثل <strong>توريد وتجارة المنتجات الزراعية</strong> أحد المجالات المهمة ضمن أنشطة كيدانكس التجارية. نعمل على توفير مجموعة متنوعة من المنتجات الزراعية لتلبية احتياجات تجار الجملة والموزعين والشركات التجارية وغيرهم من المشترين.</p><p>تشمل عملياتنا تحديد مصادر التوريد المناسبة، والتواصل مع المنتجين والمورّدين، ومراجعة جودة المنتجات، وتنسيق الطلبات، وتوفير شروط تجارية ملائمة لعمليات الشراء والتوريد.</p><p>نسعى إلى بناء علاقات موثوقة بين المورّدين والمشترين، وتوفير منتجات عالية الجودة بأسعار تنافسية. ونولي اهتمامًا خاصًا لجودة السلع، وشروط الشراء، وتكاليف التوريد، وموثوقية المورّدين، وتنسيق عمليات التسليم.</p><p>ومن خلال نهج مرن في تجارة المنتجات الزراعية، تسعى كيدانكس إلى بناء شراكات طويلة الأمد وتوسيع الفرص التجارية في الأسواق المحلية والدولية.</p><h3><strong>٤. توريد وتصدير مستحضرات التجميل والعناية الشخصية</strong></h3><p>تعمل كيدانكس في مجال توريد وتجارة وتصدير مجموعة واسعة من <strong>مستحضرات التجميل ومنتجات العناية بالبشرة والشعر والنظافة الشخصية</strong>، وغيرها من المنتجات المرتبطة بالجمال والعناية الشخصية.</p><p>نعمل على تحديد المصنّعين والمورّدين المناسبين، وتوفير المنتجات التي يحتاج إليها المشترون والموزعون، وتعزيز الروابط التجارية بين المورّدين والأسواق المستهدفة.</p><p>تركز أنشطتنا في هذا المجال على اختيار المنتجات وفقًا لاحتياجات السوق، ودراسة خيارات التوريد، وبناء العلاقات مع الشركاء التجاريين، وتنسيق عمليات الشراء والتصدير.</p><p>ومن خلال رؤيتنا للتجارة الدولية، تسعى كيدانكس إلى توسيع التعاون مع المشترين والموزعين والشركات العاملة في قطاع مستحضرات التجميل والعناية الشخصية، وفتح آفاق تجارية جديدة في هذه الأسواق.</p><h3><strong>٥. التجارة العامة وتوريد السلع والتصدير الدولي</strong></h3><p>لا تقتصر أنشطة كيدانكس التجارية على قطاع واحد أو مجموعة محددة من المنتجات، بل تشمل <strong>توريد وشراء وبيع وتصدير مجموعة واسعة من السلع</strong>، وفقًا لاحتياجات العملاء والفرص المتاحة في الأسواق.</p><p>تشمل مجالات اهتمامنا المنتجات الزراعية، والسلع الاستهلاكية، ومستحضرات التجميل والعناية الشخصية، ومواد ومنتجات التغليف، والمستلزمات الصناعية، وغيرها من السلع القابلة للتداول التجاري. ونسعى إلى توفير حلول مناسبة للتوريد، وتسهيل التواصل بين المشترين والمورّدين.</p><p>تشمل عملياتنا تحديد مصادر التوريد، ودراسة خيارات الشراء، والتفاوض بشأن الشروط التجارية، وتقييم الأسعار والجودة، وتنسيق الإجراءات المتعلقة بالمعاملات التجارية المحلية والدولية.</p><p>تعتمد كيدانكس في التجارة العامة على المرونة وفهم احتياجات السوق وبناء علاقات تجارية موثوقة. ونحرص على دراسة فرص جديدة في مختلف فئات المنتجات، بما يتيح لنا تقديم حلول توريد وتجارة تتناسب مع متطلبات العملاء المتنوعة.</p><h3><strong>٦. الاستشارات الإدارية وحلول تطوير الأعمال</strong></h3><p>إلى جانب أنشطتها الصناعية والتجارية، تقدم كيدانكس خدمات في مجال <strong>الاستشارات الإدارية وتحسين أداء الأعمال</strong>. ونسعى إلى مساعدة المؤسسات على تحديد التحديات الإدارية، وتحسين إجراءات العمل، والاستفادة الفعّالة من الموارد، وتهيئة الظروف المناسبة للنمو والتطور المستدام.</p><p>يمكن أن تشمل خدماتنا التخطيط الاستراتيجي، وتحسين العمليات التشغيلية، وخفض التكاليف، وتطوير الهياكل الإدارية والتنفيذية، وتنمية الأسواق، ورفع الكفاءة والإنتاجية.</p><p>نؤمن بأن النمو المستدام لا يقتصر على زيادة المبيعات، بل يعتمد أيضًا على الإدارة الفعّالة للموارد، واتخاذ القرارات المدروسة، وفهم الفرص السوقية، وبناء عمليات عمل أكثر كفاءة.</p><p>ومن خلال الجمع بين الرؤية التجارية وفهم الاحتياجات التشغيلية للشركات، تسعى كيدانكس إلى تقديم حلول تتناسب مع طبيعة كل مؤسسة، وتساعدها على بناء أسس قوية لتوسيع أعمالها وتحقيق أهدافها طويلة الأجل.</p><h3><strong>التزامنا</strong></h3><p>في كيدانكس، نؤمن بأن <strong>الثقة والجودة والشفافية وتحقيق القيمة المتبادلة</strong> هي الأسس التي تقوم عليها الشراكات التجارية الناجحة.</p><p>ونحرص في مختلف مجالات عملنا، بدءًا من تصنيع منتجات التغليف والتسويق الصناعي، مرورًا بتوريد المنتجات الزراعية وتصدير مستحضرات التجميل والعناية الشخصية، وصولًا إلى التجارة العامة والاستشارات الإدارية، على تقديم حلول موثوقة تتناسب مع احتياجات عملائنا.</p><p>إن تنوع أنشطتنا، وعلاقاتنا مع المصنّعين والمورّدين، ورؤيتنا الواسعة للفرص التجارية، تتيح لنا فهم احتياجات الشركات المختلفة والعمل على بناء شراكات وفرص تعاون جديدة.</p><p>نسعى إلى بناء علاقات تجارية طويلة الأمد، وتوسيع نطاق الوصول إلى الأسواق، وتسهيل عمليات توريد السلع، والمساهمة في تحقيق النمو المستدام لشركائنا التجاريين.</p><p><strong>كيدانكس — نربط الصناعات والمنتجات بالأسواق.</strong></p>', '[]'),
(1, 'en', 'About Kidanx', 'Kidanx is a multidisciplinary business holding company that operates in various fields, including industrial production, marketing and business development, domestic and international trade, commodity supply, export, and management consulting.', '<p>Kidanex is a <strong>diversified commercial holding company</strong> operating across multiple industries, including industrial manufacturing, marketing and business development, domestic and international trade, product sourcing, export, and management consulting. Our mission is to create sustainable business opportunities, strengthen professional partnerships, and deliver reliable products and services to businesses in domestic and international markets.</p><p>Our activities span a broad range of industries, from <strong>cardboard manufacturing and packaging</strong> to industrial marketing, agricultural commodities, cosmetics and personal care products, and a wide variety of other commercial goods. Through our network of manufacturers, suppliers, and business partners, we strive to connect businesses with quality products, new market opportunities, and efficient commercial solutions.</p><h3><strong>1. Industrial Manufacturing and Cardboard Packaging</strong></h3><p>Kidanex operates in the cardboard packaging industry and <strong>owns a cardboard manufacturing factory</strong>, producing packaging solutions that meet the needs of businesses across different sectors. We focus on product quality, reliable supply, and the ability to meet the diverse packaging requirements of our customers.</p><p>Our activities in this sector extend beyond manufacturing. Kidanex also provides <strong>marketing and market development services</strong> for some of the largest cardboard factories in the industry. These partnerships aim to expand customer bases, strengthen sales networks, increase market presence, and create new commercial opportunities for manufacturers.</p><p>By connecting manufacturing capabilities with market demand, we help producers reach more customers, strengthen their sales performance, and expand their businesses sustainably.</p><h3><strong>2. Marketing, Market Development, and Business Growth</strong></h3><p><strong>Marketing and market development</strong> are essential parts of Kidanex\'s business activities. We work with manufacturers, factories, and companies across various industries to identify new opportunities for product promotion, customer acquisition, and sales growth.</p><p>Our services in this area may include identifying target markets, connecting manufacturers with buyers, expanding customer networks, promoting products, and supporting the growth of commercial operations.</p><p>In addition to developing markets for our own products, Kidanex provides marketing services for partner companies. This approach helps businesses capitalize on commercial opportunities, strengthen professional relationships, reach new customers, and improve their market presence and sales performance.</p><h3><strong>3. Agricultural Products Sourcing and Trading</strong></h3><p><strong>Agricultural sourcing and trading</strong> represent an important part of Kidanex\'s commercial activities. We supply a diverse range of agricultural products to meet the needs of wholesalers, distributors, trading companies, and other buyers.</p><p>Our operations include identifying suitable supply sources, establishing relationships with producers and suppliers, assessing product quality, coordinating orders, and arranging suitable purchasing and trading terms.</p><p>We aim to build reliable connections between suppliers and buyers while providing access to quality products at competitive prices. We pay particular attention to product quality, purchasing conditions, sourcing costs, supplier reliability, and delivery coordination.</p><p>Through a flexible approach to agricultural trading, Kidanex seeks to establish long-term partnerships and expand commercial opportunities in domestic and international markets.</p><h3><strong>4. Cosmetics and Personal Care Products Sourcing and Export</strong></h3><p>Kidanex is involved in sourcing, trading, and exporting a wide range of <strong>cosmetics, skincare products, haircare products, personal hygiene goods</strong>, and other products related to beauty and personal care.</p><p>We work to identify suitable manufacturers and suppliers, source products that meet the needs of buyers and distributors, and facilitate commercial connections between suppliers and target markets.</p><p>Our activities in this sector focus on selecting products according to market demand, evaluating sourcing options, establishing relationships with business partners, and coordinating purchasing and export operations.</p><p>With an international outlook, Kidanex aims to expand cooperation with buyers, distributors, and companies in the cosmetics and personal care industry while creating new commercial opportunities in these markets.</p><h3><strong>5. General Trading, Product Sourcing, and International Export</strong></h3><p>Kidanex\'s trading activities are not limited to a single industry or a specific category of products. We engage in <strong>sourcing, purchasing, selling, and exporting</strong> a broad range of goods according to customer requirements and market opportunities.</p><p>Our areas of interest include agricultural products, consumer goods, cosmetics and personal care products, packaging materials and products, industrial supplies, and many other commercially traded goods. We aim to provide effective sourcing solutions and facilitate connections between buyers and suppliers.</p><p>Our operations may include identifying supply sources, evaluating purchasing options, negotiating commercial terms, assessing prices and quality, and coordinating activities related to domestic and international trade transactions.</p><p>Kidanex\'s approach to general trading is built on flexibility, an understanding of market needs, and the development of reliable business relationships. We continuously explore opportunities across different product categories to provide sourcing and trading solutions tailored to our customers\' requirements.</p><h3><strong>6. Management Consulting and Business Development Solutions</strong></h3><p>Alongside our manufacturing and trading activities, Kidanex provides <strong>management consulting and business improvement services</strong>. We aim to help organizations identify management challenges, improve business processes, use resources more effectively, and establish the foundations for sustainable growth and development.</p><p>Our consulting services may focus on strategic planning, operational process optimization, cost reduction, organizational and operational improvements, market development, and increased productivity.</p><p>We believe sustainable business growth involves more than increasing sales. Effective resource management, informed decision-making, market awareness, and efficient business processes are equally important to long-term success.</p><p>By combining commercial insight with an understanding of business operations, Kidanex strives to provide solutions tailored to each organization\'s circumstances and support the development of a strong foundation for business expansion and long-term success.</p><h3><strong>Our Commitment</strong></h3><p>At Kidanex, we believe that <strong>trust, quality, transparency, and mutual value</strong> are the foundations of successful business partnerships.</p><p>Across all our areas of activity, from cardboard manufacturing and industrial marketing to agricultural sourcing, cosmetics exports, general trading, and management consulting, we strive to provide reliable solutions tailored to our customers\' needs.</p><p>Our diversified activities, relationships with manufacturers and suppliers, and broad perspective on commercial opportunities enable us to address different business requirements and develop new partnerships and opportunities for collaboration.</p><p>We are committed to building long-term business relationships, expanding access to new markets, simplifying product sourcing, and contributing to the sustainable growth of our commercial partners.</p><p><strong>Kidanex — Connecting Industries, Products, and Markets.</strong></p>', '[]'),
(1, 'fa', 'درباره کیدانکس', 'کیدانکس یک هلدینگ تجاری چندرشته‌ای است که در حوزه‌های مختلفی از جمله تولید صنعتی، بازاریابی و توسعه کسب‌وکار، بازرگانی داخلی و بین‌المللی، تأمین کالا، صادرات و مشاوره مدیریت فعالیت می‌کند.', '<p>کیدانکس یک<strong> هلدینگ تجاری چندرشته‌ای</strong> است که در حوزه‌های مختلفی از جمله تولید صنعتی، بازاریابی و توسعه کسب‌وکار، بازرگانی داخلی و بین‌المللی، تأمین کالا، صادرات و مشاوره مدیریت فعالیت می‌کند. هدف ما ایجاد فرصت‌های تجاری پایدار، توسعه همکاری‌های حرفه‌ای و ارائه محصولات و خدمات قابل‌اعتماد به کسب‌وکارها در بازارهای داخلی و بین‌المللی است.</p><p>فعالیت‌های کیدانکس طیف گسترده‌ای از صنایع را در بر می‌گیرد؛ از <strong>تولید و بسته‌بندی کارتنی</strong> و بازاریابی صنعتی گرفته تا تأمین و تجارت محصولات کشاورزی، محصولات آرایشی و بهداشتی و انواع کالاهای موردنیاز بازار. ما با تکیه بر شبکه‌ای از تولیدکنندگان، تأمین‌کنندگان و شرکای تجاری، تلاش می‌کنیم مسیر دسترسی کسب‌وکارها به محصولات باکیفیت، فرصت‌های جدید بازار و راهکارهای کارآمد تجاری را هموار کنیم.</p><p> </p><h2>۱. تولید صنعتی و صنعت بسته‌بندی کارتنی</h2><p><br />کیدانکس در صنعت بسته‌بندی کارتنی، علاوه بر فعالیت‌های تجاری، <strong>دارای کارخانه تولید کارتن</strong> است و در زمینه تولید و عرضه محصولات بسته‌بندی موردنیاز کسب‌وکارها فعالیت می‌کند. ما با توجه به نیاز مشتریان، بر کیفیت محصولات، قابلیت اطمینان در تأمین و پاسخ‌گویی به نیازهای متنوع صنایع تمرکز داریم.</p><p>فعالیت ما در این حوزه به تولید محدود نمی‌شود. کیدانکس همچنین خدمات بازاریابی و توسعه بازار را برای برخی از بزرگ‌ترین کارخانه‌های کارتن‌سازی ارائه می‌دهد. این همکاری‌ها با هدف افزایش دسترسی تولیدکنندگان به مشتریان جدید، گسترش شبکه فروش، تقویت حضور در بازار و ایجاد فرصت‌های تجاری بیشتر شکل گرفته‌اند.</p><p>ما با پیوند دادن ظرفیت‌های تولیدی به نیازهای بازار، به تولیدکنندگان کمک می‌کنیم محصولات خود را به مشتریان بیشتری معرفی کنند و زمینه رشد و توسعه فعالیت‌های تجاری خود را فراهم سازند.</p><p> </p><h2>۲. بازاریابی، توسعه بازار و گسترش کسب‌وکار</h2><p><br /><strong>بازاریابی و توسعه بازار </strong>از بخش‌های مهم فعالیت‌های کیدانکس به شمار می‌روند. ما با تولیدکنندگان، کارخانه‌ها و شرکت‌های فعال در صنایع مختلف همکاری می‌کنیم تا مسیرهای جدیدی برای معرفی محصولات، جذب مشتری و توسعه فروش ایجاد شود.</p><p>خدمات ما در این حوزه می‌تواند شامل شناسایی بازارهای هدف، ایجاد ارتباط میان تولیدکنندگان و خریداران، توسعه شبکه مشتریان، معرفی محصولات و کمک به گسترش فعالیت‌های تجاری باشد.</p><p>کیدانکس علاوه بر توسعه بازار محصولات خود، در بازاریابی محصولات شرکت‌های همکار نیز فعالیت می‌کند. این رویکرد به کسب‌وکارها کمک می‌کند از ظرفیت‌های تجاری موجود بهره‌مند شوند، ارتباطات حرفه‌ای خود را گسترش دهند و فرصت‌های تازه‌ای برای افزایش فروش و حضور مؤثرتر در بازار به دست آورند.</p><p> </p><p>۳. تأمین و بازرگانی محصولات کشاورزی</p><p><br />تأمین و تجارت محصولات کشاورزی یکی از حوزه‌های فعالیت کیدانکس در بخش بازرگانی است. ما در زمینه تأمین طیف متنوعی از محصولات کشاورزی برای عمده‌فروشان، توزیع‌کنندگان، شرکت‌های بازرگانی و سایر خریداران فعالیت می‌کنیم.</p><p>فرآیند فعالیت ما شامل شناسایی منابع تأمین، برقراری ارتباط با تولیدکنندگان و عرضه‌کنندگان، بررسی کیفیت محصولات، هماهنگی سفارش‌ها و فراهم‌کردن شرایط مناسب برای خرید و تجارت است.</p><p>هدف ما ایجاد ارتباطی مطمئن میان عرضه‌کنندگان و خریداران و فراهم‌کردن امکان دسترسی به محصولات باکیفیت و قیمت‌های رقابتی است. در این مسیر، عواملی مانند کیفیت کالا، شرایط خرید، هزینه‌های تأمین، قابلیت اطمینان تأمین‌کنندگان و هماهنگی در تحویل محصولات مورد توجه قرار می‌گیرند.</p><p>کیدانکس با رویکردی منعطف در حوزه بازرگانی کشاورزی، به دنبال ایجاد همکاری‌های بلندمدت و توسعه فرصت‌های تجاری در بازارهای داخلی و خارجی است.</p><p> </p><h2>۴. تأمین و صادرات محصولات آرایشی و بهداشتی</h2><p><br />کیدانکس در زمینه تأمین، بازرگانی و صادرات انواع <strong>محصولات آرایشی، بهداشتی، مراقبت از پوست و مراقبت از مو</strong> و سایر کالاهای مرتبط با زیبایی و مراقبت شخصی فعالیت می‌کند.</p><p>ما تلاش می‌کنیم با شناسایی تولیدکنندگان و تأمین‌کنندگان مناسب، محصولات موردنیاز خریداران و توزیع‌کنندگان را تأمین کرده و زمینه ارتباط تجاری میان عرضه‌کنندگان و بازارهای هدف را فراهم کنیم.</p><p>فعالیت در این حوزه بر انتخاب محصولات متناسب با نیاز بازار، بررسی شرایط تأمین، ایجاد ارتباط با شرکای تجاری و هماهنگی فرآیندهای خرید و صادرات متمرکز است.</p><p>کیدانکس با نگاه توسعه‌محور به تجارت بین‌المللی، به دنبال گسترش همکاری با خریداران، توزیع‌کنندگان و شرکت‌های فعال در صنعت محصولات آرایشی و بهداشتی و ایجاد فرصت‌های تجاری جدید در این بازار است.</p><p> </p><h2>۵. بازرگانی عمومی، تأمین کالا و صادرات بین‌المللی</h2><p><br />فعالیت بازرگانی کیدانکس به یک صنعت یا گروه مشخص از محصولات محدود نیست. ما در حوزه <strong>تأمین، خرید، فروش و صادرات کالا</strong> در طیف گسترده‌ای از گروه‌های کالایی فعالیت می‌کنیم و متناسب با نیاز مشتریان و فرصت‌های موجود در بازار، امکان همکاری در گروه‌های مختلف کالایی را بررسی می‌کنیم.</p><p>از محصولات کشاورزی و کالاهای مصرفی گرفته تا محصولات آرایشی و بهداشتی، مواد و محصولات بسته‌بندی، ملزومات صنعتی و سایر کالاهای قابل‌تجارت، هدف ما فراهم‌کردن راهکارهای مناسب برای تأمین کالا و تسهیل ارتباط میان خریداران و عرضه‌کنندگان است.</p><p>در این مسیر، شناسایی منابع تأمین، بررسی گزینه‌های خرید، مذاکره درباره شرایط تجاری، ارزیابی قیمت و کیفیت و هماهنگی امور مرتبط با معاملات داخلی و بین‌المللی از جمله فعالیت‌های ما به شمار می‌روند.</p><p>رویکرد کیدانکس در بازرگانی عمومی بر انعطاف‌پذیری، شناخت نیاز بازار و ایجاد ارتباطات تجاری قابل‌اعتماد استوار است. ما آماده بررسی فرصت‌های جدید در حوزه‌های مختلف کالایی هستیم تا بتوانیم متناسب با نیاز مشتریان، راهکارهای مناسب برای تأمین و تجارت محصولات ارائه دهیم.</p><p> </p><h2>۶. مشاوره مدیریت و راهکارهای توسعه کسب‌وکار</h2><p><br />کیدانکس در کنار فعالیت‌های تولیدی و بازرگانی، در زمینه مشاوره مدیریت و بهبود عملکرد کسب‌وکارها نیز فعالیت می‌کند. هدف ما کمک به سازمان‌ها برای شناسایی چالش‌های مدیریتی، بهبود فرآیندهای کاری، استفاده مؤثرتر از منابع و ایجاد زمینه مناسب برای رشد و توسعه پایدار است.</p><p>خدمات این حوزه می‌تواند بر برنامه‌ریزی راهبردی، بهینه‌سازی فرآیندهای عملیاتی، کاهش هزینه‌ها، بهبود ساختارهای اجرایی، توسعه بازار و ارتقای بهره‌وری متمرکز باشد.</p><p>ما معتقدیم رشد پایدار یک کسب‌وکار تنها به افزایش فروش محدود نمی‌شود؛ بلکه مدیریت صحیح منابع، تصمیم‌گیری آگاهانه، شناخت فرصت‌های بازار و ایجاد فرآیندهای کارآمد نیز نقش مهمی در موفقیت بلندمدت دارند.</p><p>کیدانکس با بهره‌گیری از نگاه تجاری و شناخت نیازهای عملیاتی شرکت‌ها، تلاش می‌کند راهکارهایی متناسب با شرایط هر کسب‌وکار ارائه دهد و به ایجاد زیرساخت‌های مناسب برای توسعه فعالیت‌ها کمک کند.</p><p> </p><h2>تعهد ما</h2><p>در کیدانکس،<strong> اعتماد، کیفیت، شفافیت و ایجاد ارزش متقابل</strong>، اصول اساسی همکاری‌های تجاری ما هستند. ما تلاش می‌کنیم در تمام حوزه‌های فعالیت خود، از تولید محصولات بسته‌بندی و بازاریابی صنعتی گرفته تا تأمین محصولات کشاورزی، صادرات کالاهای آرایشی و بهداشتی، بازرگانی عمومی و مشاوره مدیریت، راهکارهایی قابل‌اتکا و متناسب با نیاز مشتریان ارائه دهیم.</p><p>تنوع فعالیت‌ها، ارتباط با تولیدکنندگان و تأمین‌کنندگان و نگاه گسترده به فرصت‌های تجاری، به کیدانکس امکان می‌دهد نیازهای متفاوت کسب‌وکارها را بررسی کند و زمینه شکل‌گیری همکاری‌های جدید را فراهم سازد.</p><p>ما به دنبال ایجاد روابط تجاری بلندمدت، توسعه بازارهای جدید، تسهیل فرآیند تأمین کالا و کمک به رشد پایدار شرکای تجاری خود هستیم.</p><p><strong>کیدانکس؛ پیونددهنده صنایع، کالاها و بازارها.</strong></p>', '[]'),
(2, 'ar', 'تصميم وتصنيع الكراتين', 'أيَّ كرتون تحتاجون، وبأيّ مقاس، نتولّى تصميمه وإنتاجه لكم.', '<p>مصنع الكراتين والتغليف</p><p>نصمّم وننتج كراتين التغليف للمنتجين وشركات التوزيع والمتاجر الإلكترونية والمنشآت الصناعية، ونقدّم حلولًا آمنة لتخزين البضائع ونقلها. تُصنَّع كراتيننا بأبعاد مخصّصة وطباعة خاصة وتراكيب متنوعة.</p><h2>الكراتين أحادية الجدار وثنائية الجدار والمغلّفة</h2><p>يعتمد اختيار الكرتون المناسب على وزن البضاعة وظروف تخزينها وطريقة شحنها. فالكرتون أحادي الجدار (3 طبقات) مناسب للمنتجات الخفيفة والشحنات المعتادة. أما البضائع الثقيلة أو القابلة للكسر التي تتعرّض للمناولة مرات عدة أثناء النقل، فنوصي لها بالكرتون ثنائي الجدار (5 طبقات). ويتوافر الكرتون المغلّف (اللمينيت) في الحالات التي يكون فيها المظهر الخارجي للتغليف أولوية. ويتولى مختصّونا دراسة مواصفات منتجكم واقتراح التركيب ودرجة الورق الأنسب.</p><h2>تصميم الكراتين وطباعتها حسب الطلب</h2><p>يمكن طباعة اسم علامتكم التجارية وشعارها وأي بيانات مطلوبة عن المنتج مباشرة على الكرتون. ويُنجَز كل تصميم بما يتناسب مع أبعاد الكرتون وتركيبه، لتخرج العبوة النهائية منظّمة ومتسقة مع هويتكم البصرية.</p><h2>الطلبات بالجملة بأحجام مخصّصة</h2><p>تُدرَس الطلبات بالجملة وتُنتَج وفق الكميات والمواصفات التي تحدّدونها. وتؤثر في التكلفة النهائية عوامل عدة، منها الأبعاد ونوع الورق وحجم الطلبية والطباعة وتفاصيل التصنيع.</p><h2>أسعار الكراتين وتقديم الطلبات</h2><p>يتحدّد سعر الكرتون بحسب أبعاده وعدد طبقاته وجودة المواد الخام وكمية الطلب ونوع الطباعة. وللحصول على عرض سعر، نرجو تزويدنا بمواصفات المنتج والمقاسات المطلوبة والكمية اللازمة، وسنقوم بدراسة طلبكم.</p><p><strong>لتقديم طلب أو الحصول على استشارة أو عرض سعر، يُرجى التواصل معنا.</strong></p>', '[\"أبعاد مخصّصة وطباعة حسب الطلب\",\"كراتين مموّجة أحادية الوجه وثلاثية الطبقات (3 طبقات) وخماسية الطبقات (5 طبقات)، بالإضافة إلى كراتين مغلّفة (لمينيت)\",\"إنتاج بكميات كبيرة مع تسليم سريع\"]'),
(2, 'en', 'Creating and Designing Cardboards', 'Whatever carton you need, in any size, we will design and produce it for you.', '<p>Carton and Packaging Manufacturer</p><p>We design and manufacture packaging cartons for producers, distributors, online retailers, and industrial operations, providing safe solutions for storing and transporting goods. Our cartons are made in custom dimensions, with bespoke printing and a range of structures.</p><h2>Single-Wall, Double-Wall, and Laminated Cartons</h2><p>The right carton depends on the weight of your goods, how they are stored, and how they are shipped. Single-wall (3-ply) cartons suit lightweight products and standard shipments. For heavy or fragile items that are handled several times in transit, we recommend double-wall (5-ply) construction. Laminated cartons are available where the appearance of the packaging matters most. Our specialists will review your product specifications and recommend the most suitable structure and board grade.</p><h2>Custom Carton Design and Printing</h2><p>Your brand name, logo, and any required product information can be printed directly on the carton. Each design is tailored to the dimensions and structure of the carton, so the finished packaging looks clean, consistent, and aligned with your brand identity.</p><h2>Bulk Orders in Custom Sizes</h2><p>Bulk orders are assessed and produced according to the quantity and specifications you require. Dimensions, board type, order volume, printing, and construction details all influence the final cost.</p><h2>Carton Pricing and Ordering</h2><p>The price of a carton is determined by its dimensions, number of plies, the quality of the raw materials, the order quantity, and the type of printing. To receive a quotation, please provide your product details, the sizes you need, and the quantity required, and we will review your order.</p><p><strong>To place an order, request advice, or obtain a quotation, please get in touch with us.</strong></p>', '[\"Bespoke Dimensions and Custom Printing\",\"Single-Face, Single-Wall (3-Ply), and Double-Wall (5-Ply) Corrugated Cartons, Plus Laminated Options\",\"High-Volume Production with Rapid Turnaround\"]'),
(2, 'fa', 'کارخانه تولید کارتن', 'هر کارتنی که لازم داشته باشید، به هر اندازه‌ای، برایتان طراحی و تولید می‌کنیم.', '<p><strong>کارخانه تولید کارتن و بسته‌بندی</strong></p><p>مجموعه ما در<strong> زمینه طراحی و تولید کارتن بسته‌بندی</strong> فعالیت می‌کند و برای <strong>تولیدکنندگان، شرکت‌های پخش، فروشگاه‌های اینترنتی و واحدهای صنعت</strong>ی، راهکارهایی برای بسته‌بندی، نگهداری و حمل‌ونقل ایمن کالا ارائه می‌دهد.<strong> کارتن‌ها با ابعاد سفارشی، چاپ اختصاصی و ساختارهای متنوع</strong> تولید می‌شوند.</p><h2>تولید <strong>کارتن سه‌لایه، پنج‌لایه و لمینتی</strong></h2><p>انتخاب نوع کارتن بر اساس<strong> وزن کالا</strong>، <strong>شرایط نگهداری</strong> و<strong> شیوه حمل‌ونقل</strong> انجام می‌شود. <strong>کارتن سه‌لایه برای کالاهای سبک</strong> و ارسال‌های معمولی مناسب است. برای<strong> کالاهای سنگین یا شکستنی که در مسیر حمل چند بار جابه‌جا می‌شوند، کارتن پنج‌لایه توصیه می‌شود</strong>. <strong>کارتن لمینتی نیز برای مواردی که ظاهر بسته‌بندی اهمیت بیشتری دارد قابل تولید است</strong>. کارشناسان ما با بررسی مشخصات کالا، مناسب‌ترین ساختار و نوع ورق را پیشنهاد می‌دهند.</p><p> </p><h2><strong>طراحی و چاپ اختصاصی کارتن</strong></h2><p><strong>نام برند</strong>، <strong>لوگو </strong>و اطلاعات موردنیاز محصول بر روی کارتن چاپ می‌شود. طراحی متناسب با ابعاد و ساختار هر کارتن انجام می‌گیرد تا بسته‌بندی نهایی منظم و هماهنگ با هویت بصری برند شما باشد.</p><h2>سفارش عمده کارتن با ابعاد دلخواه</h2><p>سفارش‌های عمده کارتن بر <strong>اساس تیراژ</strong> و مشخصات درخواستی بررسی و تولید می‌شود. ابعاد، نوع ورق، تعداد سفارش، چاپ و جزئیات ساخت از عوامل مؤثر بر هزینه نهایی هستند.</p><p> </p><h2><strong>قیمت کارتن و ثبت سفارش</strong></h2><p>قیمت کارتن بسته‌بندی بر اساس <strong>ابعاد</strong>، <strong>تعداد لایه‌ها</strong>،<strong> کیفیت مواد اولیه</strong>، <strong>تیراژ </strong>و<strong> نوع چاپ</strong> تعیین می‌شود. برای دریافت قیمت، ل<strong>طفاً مشخصات کالا، اندازه‌های موردنیاز و تعداد درخواستی را اعلام کنید تا سفارش شما بررسی شود.</strong></p><p> </p><p><strong>برای ثبت سفارش، دریافت مشاوره و استعلام قیمت با ما تماس بگیرید.</strong></p><p>این نسخه رسمی است، اما از کلیشه‌های متن اول (مثل «راهکارهای کاربردی» و «کیفیت بالا») دور مانده و جمله‌ها هم کوتاه‌تر و روشن‌ترند. اگر بخواهید، می‌توانم لحن را کمی بین این نسخه و نسخه قبلی تنظیم کنم.</p>', '[\"ابعاد و چاپ سفارشی\",\"کارتن تک‌لایه، سه‌لایه و پنج‌لایه و کارتن های لمینتی\",\"تولید عمده با تحویل سریع\"]'),
(3, 'ar', 'الاستشارات الإدارية والتدريب', 'نساعد المديرين على تطوير قيادتهم وبناء فرق أقوى.', '<p>نساعد المديرين على تطوير قيادتهم وبناء فرق أقوى.</p><p><br /> </p>', '[\"تدريب القيادة\",\"بناء الفرق والهيكلة\",\"تحسين العمليات والتكاليف\"]'),
(3, 'en', 'Management Consulting and Coaching', 'We help managers improve their leadership and build stronger teams.', '<p>We help managers improve their leadership and build stronger teams.</p><p><br /> </p>', '[\"Leadership coaching\",\"Team building and organization\",\"Process and cost optimization\"]'),
(3, 'fa', 'مشاوره مدیریت و کوچینگ', 'به مدیران کمک می‌کنیم رهبری خود را بهبود دهند و تیم‌هایی قوی‌تر بسازند.', '<p>به مدیران کمک می‌کنیم رهبری خود را بهبود دهند و تیم‌هایی قوی‌تر بسازند.</p><p><br /> </p>', '[\"کوچینگ رهبری\",\"تیم‌سازی و ساختار سازمانی\",\"بهینه‌سازی فرایندها و هزینه‌ها\"]'),
(4, 'ar', 'تجارة الجملة', 'نوفر ونورد منتجات عالية الجودة بالجملة وبأسعار تنافسية.', '<p>نوفر ونورد منتجات عالية الجودة بالجملة وبأسعار تنافسية.</p><p><br /> </p>', '[\"شبكة موردين موثوقين\",\"فحص الجودة\",\"أسعار جملة تنافسية\"]'),
(4, 'en', 'Wholesale Trading', 'We source and supply high-quality products in bulk at competitive prices.', '<p>We source and supply high-quality products in bulk at competitive prices.<br /> </p>', '[\"Trusted supplier network\",\"Quality inspection\",\"Competitive bulk pricing\"]'),
(4, 'fa', 'بازرگانی عمده', 'محصولات باکیفیت را به‌صورت عمده و با قیمت رقابتی تأمین و عرضه می‌کنیم.', '<p>محصولات باکیفیت را به‌صورت عمده و با قیمت رقابتی تأمین و عرضه می‌کنیم.<br /> </p>', '[\"شبکه تأمین‌کنندگان معتبر\",\"کنترل کیفیت\",\"قیمت عمده رقابتی\"]'),
(5, 'ar', 'المهندس دستیار', 'شريك مؤسس', '<p>أكثر من عشرين عامًا من الخبرة الإدارية في مجالات صناعية وإنشائية وتجارية متعددة، مع درجة الماجستير في الإدارة من جامعة طهران.</p>', '[\"ماجستير في الإدارة من جامعة طهران\",\"شهادة في الإدارة من المجمع الفني في طهران\",\"إدارة وتشغيل مصنع للكحول الطبي والصناعي\",\"إنشاء مزرعة لتربية الأبقار للحوم وتقديم الاستشارات الإدارية لها\",\"تأسيس وإدارة مجموعة قابضة لإنشاء الطرق\",\"المشاركة في أعمال الحفر لمترو كرج وطهران\",\"إدارة وتنفيذ آلاف المشاريع الإنشائية في كرج وطهران ونوشهر ومدن أخرى\",\"إدارة وإطلاق المعرض الدائم لكرج في مطار بيام\",\"تأسيس وإدارة وبناء علامة مصنع للكراتين في كرج\",\"تأسيس وإدارة مجموعة كيدانكس القابضة\"]'),
(5, 'en', 'mr.dastyar', 'Co-founder', '<p>More than twenty years of management experience across industrial, construction and commercial fields, with a master\'s degree in management from the University of Tehran.</p>', '[\"Master\'s degree in Management, University of Tehran\",\"Management certificate, Tehran Technical Complex\",\"Managed and launched a medical and industrial alcohol factory\",\"Launched a beef cattle farm and provided management consulting for it\",\"Launched and managed a road construction holding\",\"Collaborated on excavation for the Karaj and Tehran metro\",\"Managed and launched thousands of construction projects in Karaj, Tehran, Nowshahr and other cities\",\"Managed and launched the permanent Karaj exhibition at Payam Airport\",\"Launched, managed and branded a cardboard factory in Karaj\",\"Launched and manages the Kidanex holding\"]'),
(5, 'fa', 'مهندس احسان دستیار', 'بنیانگذار و مدیرعامل', '<p>بیش از بیست سال تجربه مدیریت در حوزه‌های مختلف صنعتی، عمرانی و تجاری، با مدرک کارشناسی ارشد مدیریت از دانشگاه تهران.</p>', '[\"کارشناسی ارشد مدیریت از دانشگاه تهران\",\"مدرک مدیریت از مجتمع فنی تهران\",\"مدیریت و راه‌اندازی کارخانه تولید الکل طبی و صنعتی\",\"راه‌اندازی گاوداری گوشتی و ارائه مشاوره مدیریتی در آن\",\"راه‌اندازی و مدیریت هلدینگ راه‌سازی\",\"همکاری در گودبرداری مترو کرج و تهران\",\"مدیریت و راه‌اندازی هزاران پروژه ساخت‌وساز در کرج، تهران، نوشهر و سایر شهرها\",\"مدیریت و راه‌اندازی نمایشگاه دائمی کرج در فرودگاه پیام\",\"راه‌اندازی، مدیریت و برندینگ کارخانه تولید کارتن در کرج\",\"راه‌اندازی و مدیریت هلدینگ کیدانکس\"]'),
(6, 'ar', 'المندس کیانی', 'شريك مؤسس', '<p>أكثر من عشرين عامًا من الخبرة الإدارية في مجالات صناعية وإنشائية وتجارية متعددة، مع درجة الماجستير في الإدارة من جامعة طهران.</p>', '[\"ماجستير في الإدارة من جامعة طهران\",\"شهادة في الإدارة من المجمع الفني في طهران\",\"إدارة وتشغيل مصنع للكحول الطبي والصناعي\",\"إنشاء مزرعة لتربية الأبقار للحوم وتقديم الاستشارات الإدارية لها\",\"تأسيس وإدارة مجموعة قابضة لإنشاء الطرق\",\"المشاركة في أعمال الحفر لمترو كرج وطهران\",\"إدارة وتنفيذ آلاف المشاريع الإنشائية في كرج وطهران ونوشهر ومدن أخرى\",\"إدارة وإطلاق المعرض الدائم لكرج في مطار بيام\",\"تأسيس وإدارة وبناء علامة مصنع للكراتين في كرج\",\"تأسيس وإدارة مجموعة كيدانكس القابضة\"]'),
(6, 'en', 'mr.kiany', 'Co-founder', '<p>More than twenty years of management experience across industrial, construction and commercial fields, with a master\'s degree in management from the University of Tehran.</p>', '[\"Master\'s degree in Management, University of Tehran\",\"Management certificate, Tehran Technical Complex\",\"Managed and launched a medical and industrial alcohol factory\",\"Launched a beef cattle farm and provided management consulting for it\",\"Launched and managed a road construction holding\",\"Collaborated on excavation for the Karaj and Tehran metro\",\"Managed and launched thousands of construction projects in Karaj, Tehran, Nowshahr and other cities\",\"Managed and launched the permanent Karaj exhibition at Payam Airport\",\"Launched, managed and branded a cardboard factory in Karaj\",\"Launched and manages the Kidanex holding\"]'),
(6, 'fa', 'مهندس محمد مهدی کیانی', 'بنیانگذار و مدیرعامل', '<p>بیش از بیست سال تجربه مدیریت در حوزه‌های مختلف صنعتی، عمرانی و تجاری، با مدرک کارشناسی ارشد مدیریت از دانشگاه تهران.</p>', '[\"کارشناسی ارشد مدیریت از دانشگاه تهران\",\"مدرک مدیریت از مجتمع فنی تهران\",\"مدیریت و راه‌اندازی کارخانه تولید الکل طبی و صنعتی\",\"راه‌اندازی گاوداری گوشتی و ارائه مشاوره مدیریتی در آن\",\"راه‌اندازی و مدیریت هلدینگ راه‌سازی\",\"همکاری در گودبرداری مترو کرج و تهران\",\"مدیریت و راه‌اندازی هزاران پروژه ساخت‌وساز در کرج، تهران، نوشهر و سایر شهرها\",\"مدیریت و راه‌اندازی نمایشگاه دائمی کرج در فرودگاه پیام\",\"راه‌اندازی، مدیریت و برندینگ کارخانه تولید کارتن در کرج\",\"راه‌اندازی و مدیریت هلدینگ کیدانکس\"]');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT '',
  `price` bigint(20) UNSIGNED DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `status` enum('draft','published') NOT NULL DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `slug`, `image`, `price`, `category_id`, `sort_order`, `status`, `created_at`, `updated_at`) VALUES
(1, 'cardboards', '/images/202610/7b013e8875028ae4.webp', NULL, NULL, 0, 'published', '2026-10-26 19:57:24', '2026-10-26 19:57:24'),
(2, 'consulting-services', '/images/202610/c11fca7315c1421d.webp', NULL, NULL, 0, 'published', '2026-10-26 20:02:05', '2026-10-26 20:11:09'),
(3, 'bulk-import', '/images/202610/57d4192a53817043.webp', NULL, NULL, 0, 'published', '2026-10-26 20:07:34', '2026-10-26 20:07:34');

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` int(11) NOT NULL,
  `slug` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_category_translations`
--

CREATE TABLE `product_category_translations` (
  `category_id` int(11) NOT NULL,
  `lang` char(2) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_translations`
--

CREATE TABLE `product_translations` (
  `product_id` int(11) NOT NULL,
  `lang` char(2) NOT NULL,
  `title` varchar(255) NOT NULL,
  `summary` text NOT NULL,
  `body` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_translations`
--

INSERT INTO `product_translations` (`product_id`, `lang`, `title`, `summary`, `body`) VALUES
(1, 'ar', 'مبيعات الكرتون', 'بيع جميع انواع الكرتون', '<h3>بيع الكراتين المخصصة والمقصوصة حسب الطلب</h3><p>نقدم مجموعة متنوعة من علب الكرتون ومواد التغليف بمقاسات قياسية ومخصصة، بما يتناسب مع احتياجات الشركات ومختلف القطاعات الصناعية والتجارية. يمكن للعملاء طلب الكراتين بالأبعاد والأشكال والتصاميم التي تناسب منتجاتهم، مع توفير قص دقيق وطباعة مخصصة عالية الجودة. تجمع حلول التغليف لدينا بين المتانة والعملية والمظهر الاحترافي، مما يساعد على إبراز منتجاتكم وتعزيز هوية علامتكم التجارية. وبفضل أسعارنا التنافسية، وجودة منتجاتنا، ومرونة كميات الطلب، وتنوع خيارات التخصيص، نسعى إلى توفير حلول تغليف موثوقة واقتصادية تلبي احتياجات أعمالكم. هدفنا هو تقديم كراتين عالية الجودة وفقًا لمواصفاتكم الدقيقة، مع ضمان سرعة تجهيز الطلبات وتسليمها في الوقت المناسب.</p>'),
(1, 'en', 'Cardboard sales', 'Selling all kinds of cartons', '<p>Custom-Cut and Made-to-Measure Cardboard Boxes</p><p>We offer a wide range of packaging boxes in standard and custom sizes, tailored to meet the needs of businesses across various industries. Customers can order boxes in their preferred dimensions, styles, and designs, with precise cutting and high-quality custom printing. Our packaging solutions combine durability, functionality, and professional presentation to help your products stand out. With competitive pricing, consistent quality, flexible order quantities, and a variety of customization options, we provide reliable and cost-effective packaging solutions for your business. Our goal is to deliver high-quality cardboard boxes that meet your exact specifications and ensure fast, dependable order fulfillment.</p>'),
(1, 'fa', 'فروش کارتن', 'فروش انواع کارتن', '<p>فروش انواع کارتن برش‌خورده و سفارشی</p><p>ارائه انواع کارتن‌های بسته‌بندی در ابعاد استاندارد و سفارشی، متناسب با نیاز کسب‌وکارها و صنایع مختلف. امکان سفارش کارتن در اندازه، ابعاد و مدل دلخواه، با برش دقیق و چاپ اختصاصی باکیفیت فراهم است تا بسته‌بندی محصولات شما علاوه بر استحکام و دوام، ظاهری حرفه‌ای و متمایز داشته باشد. ما با ارائه قیمت رقابتی، کیفیت مطلوب، تنوع در طراحی و تولید و امکان ثبت سفارش در تیراژهای مختلف، تلاش می‌کنیم راهکاری مطمئن و مقرون‌به‌صرفه برای بسته‌بندی محصولات شما ارائه دهیم. هدف ما تأمین کارتن‌های باکیفیت، مطابق با مشخصات درخواستی مشتریان و تحویل سفارش‌ها در کوتاه‌ترین زمان ممکن است.</p>'),
(2, 'ar', 'خدمات استشارية للطلب', 'استشارة كبار مديري المصنع لبدء خط الإنتاج و...', '<h3>نصيحة الخبراء لكبار مديري المصانع وإعداد خط الإنتاج</h3><p>تقديم خدمات استشارية متخصصة لكبار المديرين وأصحاب الصناعات والمستثمرين في مجال إطلاق خطوط إنتاج جديدة وتطوير الوحدات الصناعية وتحسينها وزيادة إنتاجية المصانع. وتشمل هذه الخدمات التحقق من جدوى المشاريع، واختيار المعدات والآلات المناسبة، وتخطيط وتصميم عمليات الإنتاج، وتوفير المواد الخام، وتقييم الطاقة الإنتاجية، وإدارة التكاليف وتحسين الموارد. وأيضًا، من خلال توفير الحلول الإدارية والفنية، فإننا نساعد المؤسسات على تقليل المخاطر التشغيلية وتحسين جودة المنتج والتحكم في تكاليف التشغيل وتحقيق أقصى استفادة من القدرات الحالية. هدفنا هو مرافقة المديرين والمستثمرين من مرحلة التفكير وصنع القرار إلى إطلاق خطوط الإنتاج وتطويرها وتحسينها المستمر، مع التركيز على الاستدامة التشغيلية وزيادة ربحية الأعمال.</p>'),
(2, 'en', 'Order consulting services', 'Consultation of the senior managers of the factory to start the production line and...', '<h3>Expert advice for senior factory managers and production line setup</h3><p>Providing specialized consulting services to senior managers, industrial owners and investors in the field of launching new production lines, developing and optimizing industrial units and increasing the productivity of factories. These services include checking the feasibility of projects, choosing suitable equipment and machinery, planning and designing production processes, providing raw materials, evaluating production capacity, managing costs and optimizing resources. Also, by providing management and technical solutions, we help organizations to reduce operational risks, improve product quality, control operational costs, and make the best use of existing capacities. Our goal is to accompany managers and investors from the ideation and decision-making stage to the launch, development and continuous improvement of production lines, focusing on operational sustainability and increasing business profitability.</p>'),
(2, 'fa', 'سفارش خدمات مشاوره', 'مشاوره مدیران ارشد کارخانه جهت راه اندازی خط تولید و ...', '<h3>مشاوره تخصصی مدیران ارشد کارخانه و راه‌اندازی خطوط تولید</h3><p>ارائه خدمات مشاوره تخصصی به مدیران ارشد، صاحبان صنایع و سرمایه‌گذاران در زمینه راه‌اندازی خطوط تولید جدید، توسعه و بهینه‌سازی واحدهای صنعتی و افزایش بهره‌وری کارخانه‌ها. این خدمات شامل بررسی امکان‌سنجی پروژه‌ها، انتخاب تجهیزات و ماشین‌آلات مناسب، برنامه‌ریزی و طراحی فرآیندهای تولید، تأمین مواد اولیه، ارزیابی ظرفیت تولید، مدیریت هزینه‌ها و بهینه‌سازی منابع است. همچنین با ارائه راهکارهای مدیریتی و فنی، به سازمان‌ها کمک می‌کنیم تا ریسک‌های اجرایی را کاهش دهند، کیفیت محصولات را ارتقا بخشند، هزینه‌های عملیاتی را کنترل کنند و از ظرفیت‌های موجود به بهترین شکل بهره ببرند. هدف ما همراهی با مدیران و سرمایه‌گذاران از مرحله ایده‌پردازی و تصمیم‌گیری تا راه‌اندازی، توسعه و بهبود مستمر خطوط تولید، با تمرکز بر پایداری عملیاتی و افزایش سودآوری کسب‌وکار است.</p>'),
(3, 'ar', 'خدمات الاستيراد والتوريد', 'استيراد وتوريد البضائع الرئيسية من الصين والعراق...', '<h3>استيراد وتوريد البضائع بالجملة من الصين والعراق والأسواق العالمية الأخرى</h3><p>نحن نقدم خدمات استيراد شاملة وتوريد كميات كبيرة من البضائع من الصين والعراق والأسواق الدولية الأخرى، وفقًا لاحتياجات الشركات والصناعات المختلفة. تشمل خدماتنا تحديد الموردين الموثوقين وتقييمهم، وإيجاد منتجات عالية الجودة، والتفاوض لتحقيق أسعار تنافسية، وتنسيق عمليات الشراء الكبرى، ودعم عملية الشراء بناءً على مواصفات العملاء واحتياجاتهم.</p><p>بدءًا من المواد الخام والمنتجات الزراعية وحتى المعدات الصناعية ولوازم التعبئة والتغليف والبضائع العامة، فإننا نسعى جاهدين لتحديد أفضل خيارات المصادر التي تناسب ميزانيات عملائنا وأهدافهم التجارية. هدفنا هو تبسيط عملية الشراء والتوريد الدولية، وتقليل تكاليف الشراء، وإقامة علاقات تجارية مستدامة وتوفير طريق موثوق وفعال للتوريد بالجملة.</p>'),
(3, 'en', 'Import and supply services', 'Major import and supply of goods from China, Iraq and...', '<h3>Import and wholesale supply of goods from China, Iraq and other international markets</h3><p>We provide comprehensive import services and bulk supply of goods from China, Iraq and other international markets, according to the needs of various businesses and industries. Our services include identifying and evaluating reliable suppliers, finding high-quality products, negotiating to achieve competitive prices, coordinating major purchases, and supporting the procurement process based on customer specifications and needs.</p><p>From raw materials and agricultural products to industrial equipment, packaging supplies and general merchandise, we strive to identify the best sourcing options to fit our clients\' budgets and business goals. Our goal is to simplify the international procurement and supply process, reduce procurement costs, establish sustainable business relationships and provide a reliable and efficient route for bulk supply.</p>'),
(3, 'fa', 'خدمات واردات و تأمین کالا', 'واردات و تامین عمده کالا از چین، عراق و ...', '<h3>واردات و تأمین عمده کالا از چین، عراق و سایر بازارهای بین‌المللی</h3><p>ما خدمات جامع واردات و تأمین عمده کالا را از چین، عراق و سایر بازارهای بین‌المللی، متناسب با نیاز کسب‌وکارها و صنایع مختلف ارائه می‌دهیم. خدمات ما شامل شناسایی و ارزیابی تأمین‌کنندگان معتبر، یافتن محصولات باکیفیت، مذاکره برای دستیابی به قیمت‌های رقابتی، هماهنگی خریدهای عمده و پشتیبانی از فرآیند تأمین کالا بر اساس مشخصات و نیازهای مشتریان است.</p><p>از مواد اولیه و محصولات کشاورزی گرفته تا تجهیزات صنعتی، ملزومات بسته‌بندی و کالاهای عمومی، تلاش می‌کنیم بهترین گزینه‌های تأمین را متناسب با بودجه و اهداف تجاری مشتریان شناسایی کنیم. هدف ما ساده‌سازی فرآیند خرید و تأمین بین‌المللی، کاهش هزینه‌های خرید، ایجاد ارتباطات تجاری پایدار و فراهم‌کردن مسیری مطمئن و کارآمد برای تأمین عمده کالا است.</p>');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `name` varchar(100) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `slug` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tag_translations`
--

CREATE TABLE `tag_translations` (
  `tag_id` int(11) NOT NULL,
  `lang` char(2) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `category_translations`
--
ALTER TABLE `category_translations`
  ADD PRIMARY KEY (`category_id`,`lang`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `type_slug` (`type`,`slug`);

--
-- Indexes for table `post_categories`
--
ALTER TABLE `post_categories`
  ADD PRIMARY KEY (`post_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `post_tags`
--
ALTER TABLE `post_tags`
  ADD PRIMARY KEY (`post_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `post_translations`
--
ALTER TABLE `post_translations`
  ADD PRIMARY KEY (`post_id`,`lang`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `product_category_translations`
--
ALTER TABLE `product_category_translations`
  ADD PRIMARY KEY (`category_id`,`lang`);

--
-- Indexes for table `product_translations`
--
ALTER TABLE `product_translations`
  ADD PRIMARY KEY (`product_id`,`lang`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `tag_translations`
--
ALTER TABLE `tag_translations`
  ADD PRIMARY KEY (`tag_id`,`lang`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category_translations`
--
ALTER TABLE `category_translations`
  ADD CONSTRAINT `category_translations_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `post_categories`
--
ALTER TABLE `post_categories`
  ADD CONSTRAINT `post_categories_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `post_tags`
--
ALTER TABLE `post_tags`
  ADD CONSTRAINT `post_tags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `post_translations`
--
ALTER TABLE `post_translations`
  ADD CONSTRAINT `post_translations_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_category_translations`
--
ALTER TABLE `product_category_translations`
  ADD CONSTRAINT `product_category_translations_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_translations`
--
ALTER TABLE `product_translations`
  ADD CONSTRAINT `product_translations_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tag_translations`
--
ALTER TABLE `tag_translations`
  ADD CONSTRAINT `tag_translations_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
