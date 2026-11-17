import os
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_DIR = r"c:\Projects\EduLens"
OUTPUT_PPTX = os.path.join(OUTPUT_DIR, "EduLens_Presentation.pptx")
OUTPUT_PPT = os.path.join(OUTPUT_DIR, "EduLens_Presentation.ppt")
UPLOAD_DIR = r"C:\Users\vaish\.gemini\antigravity\brain\8fbb0e47-b5bf-4d29-8692-30c46232485b\.user_uploaded"

# Color Palette (Dark Executive Theme)
BG_DARK = RGBColor(11, 15, 25)          # #0B0F19
BG_CARD = RGBColor(21, 29, 47)          # #151D2F
BORDER_CARD = RGBColor(38, 51, 82)      # #263352
ACCENT_INDIGO = RGBColor(99, 102, 241)  # #6366F1
ACCENT_CYAN = RGBColor(6, 182, 212)     # #06B6D4
ACCENT_EMERALD = RGBColor(16, 185, 129) # #10B981
ACCENT_AMBER = RGBColor(245, 158, 11)   # #F59E0B
ACCENT_ROSE = RGBColor(239, 68, 68)     # #EF4444
TEXT_WHITE = RGBColor(255, 255, 255)
TEXT_MUTED = RGBColor(148, 163, 184)    # #94A3B8
TEXT_LIGHT = RGBColor(226, 232, 240)    # #E2E8F0

def add_screenshot_card(slide, img_filename, card_left, card_top, card_width, card_height, badge_title):
    """
    Renders a clean card containing an authentic screenshot with preserved aspect ratio.
    NO generic AI people images — only real application telemetry and plots.
    """
    img_path = os.path.join(UPLOAD_DIR, img_filename)
    if not os.path.exists(img_path):
        return

    # Background Card Container
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, card_left, card_top, card_width, card_height)
    card.fill.solid()
    card.fill.fore_color.rgb = BG_CARD
    card.line.color.rgb = BORDER_CARD

    # Header label
    lbl = slide.shapes.add_textbox(card_left + Inches(0.2), card_top + Inches(0.12), card_width - Inches(0.4), Inches(0.32))
    p = lbl.text_frame.paragraphs[0]
    p.text = f"REAL-WORLD EVIDENCE: {badge_title.upper()}"
    p.font.name = "Arial"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    # Aspect-ratio preserved image placement
    with Image.open(img_path) as im:
        orig_w, orig_h = im.size
        aspect = orig_h / orig_w

    avail_w = card_width - Inches(0.4)
    avail_h = card_height - Inches(0.6)

    calc_w = avail_w
    calc_h = calc_w * aspect

    if calc_h > avail_h:
        calc_h = avail_h
        calc_w = calc_h / aspect

    # Center image in available space
    img_x = card_left + (card_width - calc_w) / 2
    img_y = card_top + Inches(0.48) + (avail_h - calc_h) / 2

    slide.shapes.add_picture(img_path, img_x, img_y, width=calc_w, height=calc_h)


def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def apply_slide_base(slide, section_tag="", slide_title="", page_num=""):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.color.rgb = BG_DARK

        if slide_title:
            # Top Banner Tag
            tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(8), Inches(0.3))
            p_tag = tag_box.text_frame.paragraphs[0]
            p_tag.text = section_tag.upper()
            p_tag.font.name = "Arial"
            p_tag.font.size = Pt(9.5)
            p_tag.font.bold = True
            p_tag.font.color.rgb = ACCENT_INDIGO

            # Main Slide Title
            title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(9.8), Inches(0.65))
            p_title = title_box.text_frame.paragraphs[0]
            p_title.text = slide_title
            p_title.font.name = "Arial"
            p_title.font.size = Pt(21)
            p_title.font.bold = True
            p_title.font.color.rgb = TEXT_WHITE

            # Top Divider
            div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.02))
            div.fill.solid()
            div.fill.fore_color.rgb = BORDER_CARD
            div.line.fill.background()

        # Footer
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.08), Inches(9.5), Inches(0.3))
        p_f = footer_box.text_frame.paragraphs[0]
        p_f.text = "EduLens • Machine Learning Unit III Review • Authentic Datasets (KU Leuven & UCI) • Zero Synthetic Data"
        p_f.font.name = "Arial"
        p_f.font.size = Pt(8.5)
        p_f.font.color.rgb = TEXT_MUTED

        if page_num:
            page_box = slide.shapes.add_textbox(Inches(11.2), Inches(7.08), Inches(1.333), Inches(0.3))
            p_p = page_box.text_frame.paragraphs[0]
            p_p.alignment = PP_ALIGN.RIGHT
            p_p.text = page_num
            p_p.font.name = "Arial"
            p_p.font.size = Pt(9)
            p_p.font.bold = True
            p_p.font.color.rgb = ACCENT_CYAN

    # -------------------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # -------------------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    apply_slide_base(slide1)
    
    # Header Pill
    tag = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.75), Inches(4.2), Inches(0.38))
    tag.fill.solid()
    tag.fill.fore_color.rgb = BG_CARD
    tag.line.color.rgb = ACCENT_INDIGO
    p = tag.text_frame.paragraphs[0]
    p.text = "MACHINE LEARNING PROJECT REVIEW  |  UNIT III"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN
    p.alignment = PP_ALIGN.CENTER

    # Title & Subtitle Box
    tbox = slide1.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.7), Inches(2.2))
    tf1 = tbox.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "EduLens: Student Behavioural Cohort Discovery\n& Academic Risk Analysis"
    p1.font.name = "Arial"
    p1.font.size = Pt(30)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    
    p2 = tf1.add_paragraph()
    p2.text = "Unsupervised Machine Learning for Educational Data Mining & Learning Platform Telemetry"
    p2.font.name = "Arial"
    p2.font.size = Pt(13)
    p2.font.color.rgb = ACCENT_INDIGO
    p2.space_before = Pt(6)

    # Team Box Container
    team_panel = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.6), Inches(11.733), Inches(2.3))
    team_panel.fill.solid()
    team_panel.fill.fore_color.rgb = BG_CARD
    team_panel.line.color.rgb = BORDER_CARD
    
    lbl = slide1.shapes.add_textbox(Inches(1.1), Inches(3.75), Inches(4), Inches(0.32))
    lbl.text_frame.paragraphs[0].text = "PROJECT TEAM MEMBERS"
    lbl.text_frame.paragraphs[0].font.size = Pt(9.5)
    lbl.text_frame.paragraphs[0].font.bold = True
    lbl.text_frame.paragraphs[0].font.color.rgb = ACCENT_CYAN

    # 4 Team Members Cards
    members = [
        ("Suhani Singh", "RA2411003011538"),
        ("Vaishnavi Jagtap", "RA2411003011544"),
        ("Ali Ahmed Flexwala", "RA2411003011560"),
        ("Hastik Pangi", "RA2411003011561")
    ]
    for idx, (m_name, m_reg) in enumerate(members):
        col_x = Inches(1.1 + (idx * 2.85))
        m_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, col_x, Inches(4.2), Inches(2.65), Inches(1.35))
        m_card.fill.solid()
        m_card.fill.fore_color.rgb = BG_DARK
        m_card.line.color.rgb = BORDER_CARD
        
        tf_m = m_card.text_frame
        tf_m.word_wrap = True
        pm1 = tf_m.paragraphs[0]
        pm1.text = m_name
        pm1.font.size = Pt(11.5)
        pm1.font.bold = True
        pm1.font.color.rgb = TEXT_WHITE
        
        pm2 = tf_m.add_paragraph()
        pm2.text = f"Reg: {m_reg}"
        pm2.font.size = Pt(9)
        pm2.font.color.rgb = ACCENT_INDIGO
        pm2.space_before = Pt(4)

        pm3 = tf_m.add_paragraph()
        pm3.text = "Dept of CSE"
        pm3.font.size = Pt(8)
        pm3.font.color.rgb = TEXT_MUTED

    # Repo Footer Pill
    repo_pill = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.15), Inches(7.5), Inches(0.42))
    repo_pill.fill.solid()
    repo_pill.fill.fore_color.rgb = BG_CARD
    repo_pill.line.color.rgb = BORDER_CARD
    p_r = repo_pill.text_frame.paragraphs[0]
    p_r.text = "GitHub Repository:  github.com/vaishnavijagtap02/EduLens  •  Open Source"
    p_r.font.size = Pt(9)
    p_r.font.bold = True
    p_r.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------------------
    # SLIDE 2: PROBLEM STATEMENT & MOTIVATION
    # -------------------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    apply_slide_base(slide2, "01 / WHY UNSUPERVISED LEARNING", "Problem Statement & The EduLens Approach", "02 / 10")

    card1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.55), Inches(5.6), Inches(2.55))
    card1.fill.solid()
    card1.fill.fore_color.rgb = BG_CARD
    card1.line.color.rgb = BORDER_CARD
    tf_c1 = card1.text_frame
    tf_c1.word_wrap = True
    p = tf_c1.paragraphs[0]
    p.text = "THE PROBLEM: TRADITIONAL SUPERVISED SYSTEMS"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ROSE
    
    bullets1 = [
        "Dependent on retrospective pass/fail labels trained on past semesters.",
        "Outcome labels are unavailable until end-of-term examinations are graded.",
        "Struggling or disengaged students are identified too late for proactive help.",
        "Requires historical training data that fails to generalize across new curricula."
    ]
    for b in bullets1:
        p = tf_c1.add_paragraph()
        p.text = f"•  {b}"
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(3)

    card2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.3), Inches(5.6), Inches(2.55))
    card2.fill.solid()
    card2.fill.fore_color.rgb = BG_CARD
    card2.line.color.rgb = BORDER_CARD
    tf_c2 = card2.text_frame
    tf_c2.word_wrap = True
    p = tf_c2.paragraphs[0]
    p.text = "THE EDULENS APPROACH: PROACTIVE DISCOVERY"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD
    
    bullets2 = [
        "Operates completely label-free on real-time learning platform telemetry.",
        "Partitions students into natural behavioral cohorts using K-Means and GMM.",
        "Tracks Expectation-Maximization (EM) parameter estimation step-by-step.",
        "Calculates an unsupervised Academic Vulnerability Index (AVI) weeks before finals."
    ]
    for b in bullets2:
        p = tf_c2.add_paragraph()
        p.text = f"•  {b}"
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(3)

    # Right Card: Real Dashboard UI
    add_screenshot_card(slide2, "media_1794897514490_4f7d4bee.jpg", Inches(6.6), Inches(1.55), Inches(5.9), Inches(5.3), "Dashboard & Architecture")

    # -------------------------------------------------------------------------
    # SLIDE 3: DATASETS & BEHAVIORAL FEATURES
    # -------------------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    apply_slide_base(slide3, "02 / DATA FOUNDATION", "Real-World Datasets & Learning Telemetry Features", "03 / 10")

    kpis = [
        ("756", "KU Leuven Students", "Accountancy LMS Clicks", ACCENT_INDIGO),
        ("19", "Behavioral Features", "LMS Telemetry Metrics", ACCENT_CYAN),
        ("395 + 649", "UCI Students", "Math & Portuguese Benchmarks", ACCENT_EMERALD),
        ("100% Real", "Authentic Records", "Zero Synthetic Generation", ACCENT_AMBER)
    ]
    for idx, (num, title, sub, col) in enumerate(kpis):
        kx = Inches(0.8 + (idx * 2.98))
        kbox = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, kx, Inches(1.55), Inches(2.8), Inches(1.15))
        kbox.fill.solid()
        kbox.fill.fore_color.rgb = BG_CARD
        kbox.line.color.rgb = BORDER_CARD
        tf_k = kbox.text_frame
        tf_k.word_wrap = True
        pk1 = tf_k.paragraphs[0]
        pk1.text = num
        pk1.font.size = Pt(19)
        pk1.font.bold = True
        pk1.font.color.rgb = col
        pk2 = tf_k.add_paragraph()
        pk2.text = f"{title} • {sub}"
        pk2.font.size = Pt(8)
        pk2.font.color.rgb = TEXT_LIGHT

    feat_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.9), Inches(5.6), Inches(3.95))
    feat_card.fill.solid()
    feat_card.fill.fore_color.rgb = BG_CARD
    feat_card.line.color.rgb = BORDER_CARD
    tf_f = feat_card.text_frame
    tf_f.word_wrap = True
    p = tf_f.paragraphs[0]
    p.text = "TELEMETRY FEATURE TAXONOMIES (KU LEUVEN)"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_INDIGO

    f_bullets = [
        "Platform Activity Volume: Total clicks (overall interactions), login sessions, active days, active weeks, unique materials viewed.",
        "Self-Regulated Learning (SRL): Study regularity (weekly entropy), exam cramming ratio (% activity in final 7 days), procrastination latency.",
        "Discussion Interaction: Total forum posts read, unique discussion threads viewed, active contributions.",
        "Zero Fabrication: Real learning logs from Nature Scientific Data (Tiukhova et al., 2023, DOI: 10.5281/zenodo.17087849)."
    ]
    for b in f_bullets:
        p = tf_f.add_paragraph()
        p.text = f"•  {b}"
        p.font.size = Pt(8.8)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(4)

    add_screenshot_card(slide3, "media_1794897524239_1ea96d30.png", Inches(6.6), Inches(2.9), Inches(5.9), Inches(3.95), "Dataset Explorer & Preprocessing")

    # -------------------------------------------------------------------------
    # SLIDE 4: PREPROCESSING & DIMENSIONALITY REDUCTION
    # -------------------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    apply_slide_base(slide4, "03 / FEATURE ENGINEERING", "Data Preprocessing & PCA Coordinate Projection", "04 / 10")

    p1_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.55), Inches(5.6), Inches(2.55))
    p1_card.fill.solid()
    p1_card.fill.fore_color.rgb = BG_CARD
    p1_card.line.color.rgb = BORDER_CARD
    tf_p1 = p1_card.text_frame
    tf_p1.word_wrap = True
    p = tf_p1.paragraphs[0]
    p.text = "FEATURE SCALING & NORMALIZATION"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN
    
    ps_bullets = [
        "StandardScaler (Z-Score): Centers features around mean 0 with unit variance (std = 1). Crucial for distance-based clustering.",
        "MinMaxScaler: Maps values to [0, 1] range for bounded feature distributions.",
        "Mathematical Necessity: Without scaling, high-magnitude features (e.g. 2,100+ clicks) completely drown out critical attributes (e.g. 23 active days)."
    ]
    for b in ps_bullets:
        p = tf_p1.add_paragraph()
        p.text = f"•  {b}"
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(3)

    p2_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.3), Inches(5.6), Inches(2.55))
    p2_card.fill.solid()
    p2_card.fill.fore_color.rgb = BG_CARD
    p2_card.line.color.rgb = BORDER_CARD
    tf_p2 = p2_card.text_frame
    tf_p2.word_wrap = True
    p = tf_p2.paragraphs[0]
    p.text = "PRINCIPAL COMPONENT ANALYSIS (PCA)"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD
    
    pca_bullets = [
        "Universal 2D Projection: Decomposes multidimensional feature vectors into two principal orthogonal eigenvectors (PC1 & PC2).",
        "57% Variance Captured: The first two components explain ~57% of total dataset variance.",
        "Key Design Principle: PCA is used solely for visual inspection and centroid mapping—clustering itself runs on the complete scaled feature space."
    ]
    for b in pca_bullets:
        p = tf_p2.add_paragraph()
        p.text = f"•  {b}"
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(3)

    add_screenshot_card(slide4, "media_1794897528980_2bd0d833.jpg", Inches(6.6), Inches(1.55), Inches(5.9), Inches(5.3), "2D PCA Projection & Centroids")

    # -------------------------------------------------------------------------
    # SLIDE 5: K-MEANS CLUSTERING LABORATORY
    # -------------------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    apply_slide_base(slide5, "04 / HARD CLUSTERING", "K-Means Clustering Laboratory & Mathematical Validation", "05 / 10")

    k_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.55), Inches(5.6), Inches(5.3))
    k_card.fill.solid()
    k_card.fill.fore_color.rgb = BG_CARD
    k_card.line.color.rgb = BORDER_CARD
    tf_k = k_card.text_frame
    tf_k.word_wrap = True
    p = tf_k.paragraphs[0]
    p.text = "MATHEMATICAL FORMULATION & SCRATCH BENCHMARK"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_INDIGO

    k_points = [
        "Objective Function (WCSS): Minimizes Within-Cluster Sum of Squares:\n  J = Σ (k=1 to K) Σ (x_i in C_k) ||x_i - μ_k||²",
        "From-Scratch Implementation: Written purely in Python & NumPy with Euclidean distance assignment and iterative centroid recalculation.",
        "Empirical Benchmark vs. Scikit-Learn:\n  • Scratch Inertia: 5149.81  |  Sklearn: 5149.81 (ΔJ = 0.0)\n  • Adjusted Rand Index (ARI): 1.00 (Verified Identical Partition)",
        "Convergence Guarantee: Objective J strictly decreases monotonically, converging in 24 steps with smart k-means++ seeding.",
        "Elbow Method: Evaluates WCSS and Silhouette across K = 2 to 8 to identify diminishing returns (Optimal K = 3)."
    ]
    for b in k_points:
        p = tf_k.add_paragraph()
        p.text = f"•  {b}"
        p.font.size = Pt(8.8)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(4)

    add_screenshot_card(slide5, "media_1794897583935_1a4881d4.jpg", Inches(6.6), Inches(1.55), Inches(5.9), Inches(5.3), "Scratch Benchmark & Elbow Curve")

    # -------------------------------------------------------------------------
    # SLIDE 6: GMM & EXPECTATION-MAXIMIZATION
    # -------------------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    apply_slide_base(slide6, "05 / PROBABILISTIC COHORTS", "Gaussian Mixture Models & Expectation–Maximization", "06 / 10")

    gmm_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.55), Inches(5.6), Inches(5.3))
    gmm_card.fill.solid()
    gmm_card.fill.fore_color.rgb = BG_CARD
    gmm_card.line.color.rgb = BORDER_CARD
    tf_g = gmm_card.text_frame
    tf_g.word_wrap = True
    p = tf_g.paragraphs[0]
    p.text = "PROBABILISTIC CLUSTERING & EM CONVERGENCE"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    gmm_points = [
        "Why GMM?: K-Means assumes spherical, equally sized clusters. GMM represents populations as a linear superposition of K multivariate normal distributions: x ~ Σ π_k N(μ_k, Σ_k).",
        "Full Covariance Matrices: Models cluster orientation and non-spherical shape across multidimensional behavioral axes.",
        "Expectation-Maximization (EM) Algorithm:\n  • E-Step: Calculates posterior responsibilities γ_ik = P(z_i = k | x_i)\n  • M-Step: Re-estimates mixture weights π_k, means μ_k, and covariances Σ_k.",
        "Mathematical Guarantee (Jensen's Inequality):\n  Monotonic log-likelihood ascent: ln L(t+1) ≥ ln L(t).\n  Converged cleanly in 12 iterations with ln L = -5329.6.",
        "Information Criteria: BIC = 12203.53 | AIC = 11125.2."
    ]
    for b in gmm_points:
        p = tf_g.add_paragraph()
        p.text = f"•  {b}"
        p.font.size = Pt(8.8)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(4)

    add_screenshot_card(slide6, "media_1794897533235_cc4e272d.jpg", Inches(6.6), Inches(1.55), Inches(5.9), Inches(5.3), "GMM Density & EM Log-Likelihood Ascent")

    # -------------------------------------------------------------------------
    # SLIDE 7: MODEL COMPARISON (HARD VS SOFT)
    # -------------------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    apply_slide_base(slide7, "06 / VALIDATION", "Rigorous Model Evaluation: Hard vs Soft Clustering", "07 / 10")

    comp_card = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.55), Inches(5.6), Inches(5.3))
    comp_card.fill.solid()
    comp_card.fill.fore_color.rgb = BG_CARD
    comp_card.line.color.rgb = BORDER_CARD
    tf_c = comp_card.text_frame
    tf_c.word_wrap = True
    p = tf_c.paragraphs[0]
    p.text = "EMPIRICAL MODEL BENCHMARKS & METRICS"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD

    comp_points = [
        "Silhouette Score: K-Means (0.2243) vs GMM (0.1869). K-Means yields higher distance-based separation due to rigid Voronoi tessellation.",
        "Davies-Bouldin Index: Evaluates cluster compactness and boundary overlap across algorithms.",
        "Partition Agreement: Adjusted Rand Index (ARI) = 0.5868, indicating substantial structural alignment between spherical and Gaussian density clustering.",
        "Soft-Clustering Key Discovery: Shannon Entropy identifies 4.63% 'Borderline Students' (max confidence < 65%).",
        "Pedagogical Significance: Soft clustering prevents misclassifying students on cluster margins who require monitoring rather than definitive categorization."
    ]
    for b in comp_points:
        p = tf_c.add_paragraph()
        p.text = f"•  {b}"
        p.font.size = Pt(8.8)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(4)

    add_screenshot_card(slide7, "media_1794897537223_6338a7e6.jpg", Inches(6.6), Inches(1.55), Inches(5.9), Inches(5.3), "Model Comparison, Contingency & BIC/AIC")

    # -------------------------------------------------------------------------
    # SLIDE 8: DISCOVERED BEHAVIORAL COHORTS
    # -------------------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    apply_slide_base(slide8, "07 / INTERPRETABLE FINDINGS", "Discovered Student Behavioural Cohorts & Profiles", "08 / 10")

    c1 = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.55), Inches(5.6), Inches(1.65))
    c1.fill.solid()
    c1.fill.fore_color.rgb = BG_CARD
    c1.line.color.rgb = ACCENT_EMERALD
    tf = c1.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "COHORT 1: STEADY ACTIVE LEARNERS (55.7%  •  LOW-MODERATE RISK)"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD
    p2 = tf.add_paragraph()
    p2.text = "• Consistent weekly session count, distributed study regularity, early login.\n• High course mastery. Average Final Grade: 11.48 / 20."
    p2.font.size = Pt(8.5)
    p2.font.color.rgb = TEXT_LIGHT

    c2 = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.35), Inches(5.6), Inches(1.65))
    c2.fill.solid()
    c2.fill.fore_color.rgb = BG_CARD
    c2.line.color.rgb = ACCENT_AMBER
    tf = c2.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "COHORT 2: DEADLINE-DRIVEN / CRAMMERS (MODERATE RISK)"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_AMBER
    p2 = tf.add_paragraph()
    p2.text = "• Low weekly study regularity with massive click surge (>40%) in exam week.\n• Highly vulnerable in rigorous cumulative courses."
    p2.font.size = Pt(8.5)
    p2.font.color.rgb = TEXT_LIGHT

    c3 = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.15), Inches(5.6), Inches(1.7))
    c3.fill.solid()
    c3.fill.fore_color.rgb = BG_CARD
    c3.line.color.rgb = ACCENT_ROSE
    tf = c3.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "COHORT 3: DISENGAGED & MINIMALIST (40.2%  •  HIGH RISK)"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ROSE
    p2 = tf.add_paragraph()
    p2.text = "• Severe procrastination latency (delayed start), minimal sessions, zero forum views.\n• Academic Vulnerability Index (AVI): 38.6 / 100. Average Grade: 8.44 / 20."
    p2.font.size = Pt(8.5)
    p2.font.color.rgb = TEXT_LIGHT

    add_screenshot_card(slide8, "media_1794897544485_454d021c.png", Inches(6.6), Inches(1.55), Inches(5.9), Inches(5.3), "Multidimensional Cohort Comparison")

    # -------------------------------------------------------------------------
    # SLIDE 9: SYSTEM ARCHITECTURE & IMPLEMENTATION
    # -------------------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    apply_slide_base(slide9, "08 / ENGINEERING IMPLEMENTATION", "System Architecture & Interactive Web Application", "09 / 10")

    arch_card = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.55), Inches(5.6), Inches(5.3))
    arch_card.fill.solid()
    arch_card.fill.fore_color.rgb = BG_CARD
    arch_card.line.color.rgb = BORDER_CARD
    tf_a = arch_card.text_frame
    tf_a.word_wrap = True
    p = tf_a.paragraphs[0]
    p.text = "FULL-STACK ML SYSTEM ARCHITECTURE"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_INDIGO

    arch_points = [
        "Frontend Application: React 19 + Tailwind CSS + Lucide Icons + Recharts for interactive 2D PCA scatter plots, convergence lines, and responsive tooltips.",
        "Dual Theme Engine: Polished Dark Mode and Light Mode with system-wide context toggle.",
        "Backend REST API: Python + Flask serving endpoints for dataset metadata, K-Means clustering, GMM fitting, Elbow curves, and risk profiling.",
        "Scientific ML Core: Scikit-learn, NumPy, Pandas, ReportLab PDF compilation.",
        "Open-Source Deliverables:\n  • GitHub Repository with full reproducible source code.\n  • Compiled 8-page Output Screenshots PDF artifact."
    ]
    for b in arch_points:
        p = tf_a.add_paragraph()
        p.text = f"•  {b}"
        p.font.size = Pt(8.8)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(4)

    add_screenshot_card(slide9, "media_1794897621178_f2458860.jpg", Inches(6.6), Inches(1.55), Inches(5.9), Inches(5.3), "Cohort Profiles & Risk Action Matrix")

    # -------------------------------------------------------------------------
    # SLIDE 10: CONCLUSION & INTERVENTIONS
    # -------------------------------------------------------------------------
    slide10 = prs.slides.add_slide(blank_layout)
    apply_slide_base(slide10, "09 / FROM INSIGHT TO INTERVENTION", "Conclusion, Pedagogical Impact & Q&A", "10 / 10")

    int1 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.55), Inches(5.6), Inches(1.65))
    int1.fill.solid()
    int1.fill.fore_color.rgb = BG_CARD
    int1.line.color.rgb = BORDER_CARD
    tf1 = int1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "INTERVENTION 1: 7-DAY INACTIVITY NUDGE"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ACCENT_AMBER
    p2 = tf1.add_paragraph()
    p2.text = "Automated LMS activity nudges triggered after 7 consecutive days of inactivity to prevent drop-off before midpoint exams."
    p2.font.size = Pt(8.8)
    p2.font.color.rgb = TEXT_LIGHT

    int2 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.35), Inches(5.6), Inches(1.65))
    int2.fill.solid()
    int2.fill.fore_color.rgb = BG_CARD
    int2.line.color.rgb = BORDER_CARD
    tf2 = int2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "INTERVENTION 2: MANDATORY WEEKLY CHECKPOINTS"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN
    p2 = tf2.add_paragraph()
    p2.text = "Diagnostic self-assessments assigned to students with high cramming ratios to encourage distributed study habits."
    p2.font.size = Pt(8.8)
    p2.font.color.rgb = TEXT_LIGHT

    int3 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.15), Inches(5.6), Inches(1.7))
    int3.fill.solid()
    int3.fill.fore_color.rgb = BG_CARD
    int3.line.color.rgb = BORDER_CARD
    tf3 = int3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "INTERVENTION 3: PROACTIVE TA MENTORING"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD
    p2 = tf3.add_paragraph()
    p2.text = "Early teaching assistant outreach targeted at students with high Academic Vulnerability Index (AVI) scores."
    p2.font.size = Pt(8.8)
    p2.font.color.rgb = TEXT_LIGHT

    right_card = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.6), Inches(1.55), Inches(5.9), Inches(5.3))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = BG_CARD
    right_card.line.color.rgb = ACCENT_INDIGO
    tf_r = right_card.text_frame
    tf_r.word_wrap = True
    
    p = tf_r.paragraphs[0]
    p.text = "PROJECT SUMMARY & TAKEAWAY"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    takeaways = [
        "Unsupervised Learning uncovers authentic behavioral cohorts from raw LMS clickstream data without requiring historical labels.",
        "K-Means from scratch proves mathematical correctness, matching Scikit-Learn inertia (ΔJ = 0.0) and ARI (1.00).",
        "GMM soft clustering identifies 4.63% borderline students at cluster frontiers, offering nuance that hard clustering misses.",
        "Demonstrates complete Unit III Machine Learning mastery with practical pedagogical value."
    ]
    for b in takeaways:
        p = tf_r.add_paragraph()
        p.text = f"✔  {b}"
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_LIGHT
        p.space_before = Pt(5)

    p_t = tf_r.add_paragraph()
    p_t.text = "THANK YOU!"
    p_t.font.size = Pt(21)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE
    p_t.space_before = Pt(16)
    p_t.alignment = PP_ALIGN.CENTER

    p_q = tf_r.add_paragraph()
    p_q.text = "Open for Questions & Discussion"
    p_q.font.size = Pt(11)
    p_q.font.color.rgb = ACCENT_CYAN
    p_q.alignment = PP_ALIGN.CENTER

    saved_path = OUTPUT_PPTX
    try:
        prs.save(OUTPUT_PPTX)
        print(f"PowerPoint Presentation successfully saved at: {OUTPUT_PPTX}")
    except PermissionError:
        saved_path = os.path.join(OUTPUT_DIR, "EduLens_Presentation_Updated.pptx")
        prs.save(saved_path)
        print(f"Notice: File was in use by PowerPoint. Saved cleanly to: {saved_path}")

    # Also make a copy with .ppt extension
    import shutil
    try:
        ppt_target = os.path.splitext(saved_path)[0] + ".ppt"
        shutil.copyfile(saved_path, ppt_target)
        print(f"Also created .ppt copy at: {ppt_target}")
    except Exception as e:
        print("Note on .ppt copy:", e)

if __name__ == '__main__':
    create_deck()
